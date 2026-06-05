"use client";

import { useActionState } from "react";
import { Upload } from "lucide-react";
import { LEVELS, SKILLS } from "@/lib/constants";
import type { Group } from "@/lib/types";
import { createMaterial, type MaterialState } from "../actions";

export function MaterialForm({ groups }: { groups: Pick<Group, "id" | "name" | "level">[] }) {
  const [state, action, pending] = useActionState<MaterialState, FormData>(createMaterial, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="label" htmlFor="title">Title</label>
        <input id="title" name="title" required className="input" placeholder="e.g. IELTS Listening — Section 3 practice" />
      </div>
      <div>
        <label className="label" htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={3} className="input" placeholder="Optional notes for students" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="level">Level</label>
          <select id="level" name="level" required defaultValue="" className="input">
            <option value="" disabled>Choose…</option>
            {LEVELS.map((l) => (
              <option key={l.key} value={l.key}>{l.short} · {l.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="skill">Skill</label>
          <select id="skill" name="skill" required defaultValue="" className="input">
            <option value="" disabled>Choose…</option>
            {SKILLS.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="group_id">Group (optional)</label>
        <select id="group_id" name="group_id" defaultValue="" className="input">
          <option value="">All groups in this level</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-dashed border-border p-3">
        <label className="label" htmlFor="file">Upload a file</label>
        <input id="file" name="file" type="file" className="w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-surface file:px-3 file:py-2 file:text-fg" />
        <div className="my-2 text-center text-xs text-subtle">— or —</div>
        <label className="label" htmlFor="video_url">Video link</label>
        <input id="video_url" name="video_url" type="url" className="input" placeholder="https://youtube.com/…" />
      </div>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <button type="submit" disabled={pending} className="btn-primary w-full py-3">
        <Upload className="h-4 w-4" /> {pending ? "Uploading…" : "Add material"}
      </button>
    </form>
  );
}
