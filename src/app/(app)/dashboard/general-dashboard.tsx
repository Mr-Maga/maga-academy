import { Sparkles, BookOpen, MessageCircle, Headphones, ArrowRight } from "lucide-react";
import { Logo } from "@/components/brand";
import { chooseLearningPath } from "@/app/onboarding/actions";
import type { Profile } from "@/lib/types";

// General English track is on the roadmap (Phase 3). Until then we show a
// polished placeholder with a way to jump into the ready IELTS track.
export async function GeneralDashboard({ profile }: { profile: Profile }) {
  const first = (profile.full_name || profile.email || "do‘st").split(/[ @]/)[0];
  const switchToIelts = chooseLearningPath.bind(null, "ielts");

  return (
    <div className="stagger space-y-5">
      <section className="card relative overflow-hidden p-6 text-center">
        <span className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo/15 blur-3xl" />
        <Logo className="mx-auto h-14 w-14 text-2xl" />
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight">Salom, {first}! 💬</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
          <span className="font-semibold text-fg">General English</span> kursi hozir tayyorlanmoqda —
          grammar, kundalik suhbat, tinglash va daraja testi bilan.
        </p>
        <span className="chip mx-auto mt-4 w-fit bg-amber/15 text-amber">
          <Sparkles className="h-3.5 w-3.5" /> Tez kunda
        </span>
      </section>

      <section className="grid grid-cols-3 gap-3 text-center">
        {[
          { icon: BookOpen, label: "Grammar" },
          { icon: MessageCircle, label: "Speaking" },
          { icon: Headphones, label: "Listening" },
        ].map((f) => (
          <div key={f.label} className="card flex flex-col items-center gap-2 p-4 opacity-80">
            <f.icon className="h-5 w-5 text-indigo" />
            <span className="text-xs font-medium text-muted">{f.label}</span>
          </div>
        ))}
      </section>

      <section className="card space-y-3 p-5">
        <h2 className="font-bold">Kutib o‘tirmang 🚀</h2>
        <p className="text-sm text-muted">
          IELTS yo‘li to‘liq tayyor — Writing & Speaking AI baho, lug‘at va mashqlar. Bemalol
          sinab ko‘ring, xohlasangiz keyin General’ga qaytasiz.
        </p>
        <form action={switchToIelts}>
          <button type="submit" className="btn-primary w-full py-3">
            IELTS bilan boshlash <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </section>
    </div>
  );
}
