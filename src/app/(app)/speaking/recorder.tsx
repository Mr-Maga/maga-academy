"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Square, RotateCcw } from "lucide-react";

/* Records mic audio and encodes a 16 kHz mono 16-bit WAV (a format Gemini reads
   reliably on every browser, including Safari). Calls onRecorded(blob) when done. */

function downsample(buffer: Float32Array, inRate: number, outRate: number): Float32Array {
  if (outRate >= inRate) return buffer;
  const ratio = inRate / outRate;
  const newLen = Math.round(buffer.length / ratio);
  const result = new Float32Array(newLen);
  for (let i = 0; i < newLen; i++) {
    const start = Math.round(i * ratio);
    const end = Math.min(Math.round((i + 1) * ratio), buffer.length);
    let sum = 0;
    let count = 0;
    for (let j = start; j < end; j++) {
      sum += buffer[j];
      count++;
    }
    result[i] = count ? sum / count : 0;
  }
  return result;
}

function encodeWav(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeString = (off: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i));
  };
  writeString(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, samples.length * 2, true);
  let off = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    off += 2;
  }
  return new Blob([view], { type: "audio/wav" });
}

export function VoiceRecorder({ onRecorded }: { onRecorded: (blob: Blob | null) => void }) {
  const [status, setStatus] = useState<"idle" | "recording" | "done">("idle");
  const [seconds, setSeconds] = useState(0);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const procRef = useRef<ScriptProcessorNode | null>(null);
  const srcRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const chunksRef = useRef<Float32Array[]>([]);
  const rateRef = useRef(48000);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = () => {
    try {
      procRef.current?.disconnect();
      srcRef.current?.disconnect();
    } catch {}
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (ctxRef.current && ctxRef.current.state !== "closed") void ctxRef.current.close();
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => () => cleanup(), []);

  async function start() {
    setError(null);
    if (url) {
      URL.revokeObjectURL(url);
      setUrl(null);
    }
    onRecorded(null);
    chunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      ctxRef.current = ctx;
      rateRef.current = ctx.sampleRate;
      const source = ctx.createMediaStreamSource(stream);
      srcRef.current = source;
      const proc = ctx.createScriptProcessor(4096, 1, 1);
      procRef.current = proc;
      proc.onaudioprocess = (e) => {
        chunksRef.current.push(new Float32Array(e.inputBuffer.getChannelData(0)));
      };
      source.connect(proc);
      proc.connect(ctx.destination);
      setSeconds(0);
      setStatus("recording");
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      setError("Mikrofonga ruxsat berilmadi. Brauzer sozlamasidan ruxsat bering.");
    }
  }

  function stop() {
    if (timerRef.current) clearInterval(timerRef.current);
    try {
      procRef.current?.disconnect();
      srcRef.current?.disconnect();
    } catch {}
    streamRef.current?.getTracks().forEach((t) => t.stop());

    // Merge chunks → downsample → WAV.
    const total = chunksRef.current.reduce((n, c) => n + c.length, 0);
    const merged = new Float32Array(total);
    let pos = 0;
    for (const c of chunksRef.current) {
      merged.set(c, pos);
      pos += c.length;
    }
    if (ctxRef.current && ctxRef.current.state !== "closed") void ctxRef.current.close();

    const out = downsample(merged, rateRef.current, 16000);
    const blob = encodeWav(out, 16000);
    setUrl(URL.createObjectURL(blob));
    onRecorded(blob);
    setStatus("done");
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="space-y-2">
      {status === "idle" && (
        <button type="button" onClick={start} className="btn bg-primary w-full py-3 text-primary-fg">
          <Mic className="h-5 w-5" /> Yozishni boshlash
        </button>
      )}
      {status === "recording" && (
        <button type="button" onClick={stop} className="btn w-full bg-danger py-3 text-white">
          <Square className="h-5 w-5" /> To‘xtatish · {mm}:{ss}
        </button>
      )}
      {status === "done" && (
        <div className="space-y-2">
          {url && <audio src={url} controls className="w-full" />}
          <button type="button" onClick={start} className="btn-ghost w-full py-2.5 text-sm">
            <RotateCcw className="h-4 w-4" /> Qayta yozish
          </button>
        </div>
      )}
      {status === "recording" && (
        <p className="text-center text-xs text-muted">🎙️ Gapiring… tugatgach “To‘xtatish”ni bosing.</p>
      )}
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
