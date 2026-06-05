# Maga Academy

A mobile-first **IELTS & English learning platform** for a language centre.

**Stack:** Next.js 16 (App Router, TypeScript) · Tailwind CSS v4 · Supabase (Postgres + Auth + Storage) · Google Gemini · Telegram · Vercel. Dark, purple-first design.

> 🚀 **New here? Read [`SETUP.md`](./SETUP.md)** — step-by-step setup from zero (no SQL by hand).

---

## What's inside

- **Auth** — "Continue with Google" (primary) + email/password (fallback). First sign-in → `/claim`, where a one-time code sets the role **once**:
  - `99maga00` → admin, `askelad` → teacher, `kuroku` → student (or parent via a checkbox).
  - Codes live in a Postgres `SECURITY DEFINER` function (`claim_role`) + a guard trigger + RLS, so users can't escalate their own role.
- **Roles** — admin, teacher, student, parent (each with its own dashboard & navigation).
- **Access gating** — students/parents register → **pending**; admin approves with a **+30-day** expiry; auto-locks after expiry until renewed. Parents unlock when their linked child is active.
- **6 levels** — Beginner A1, Elementary A2, Pre-Intermediate B1, Intermediate B2, CEFR, IELTS. Students see only their level.
- **Skills** — Listening/Reading/Writing/Speaking materials (file upload or video link), level- & group-restricted.
- **Homework** — assign by level/group with deadlines; students submit text/file; teachers grade with a score + comment; a red **"did not do homework"** flag per student.
- **Practice Lab** — shadowing (record + playback) and a typing trainer (WPM/accuracy), with a daily streak and a settable goal.
- **Ranking** — overall + within-group, from teacher scores.
- **Progress + Parent portal** — scores over time, homework %, weakest skill, streak (parents see only their child, read-only).
- **AI tutor "Maga" (Gemini)** — floating chat for students & parents (replies in Uzbek/Russian/English, polite "siz"); AI summary of complaints & feedback for staff.
- **Telegram** — parents send complaints / students send weekly feedback via the bot → stored + forwarded to the centre; placement results also go to Telegram.
- **Placement test** — reading + listening + speaking, hardest items per level → recommends a level.

## Develop

```bash
npm install
cp .env.example .env.local   # then fill in your keys (see SETUP.md)
npm run dev                  # http://localhost:3000
npm run build                # production build
```

## Project layout

```
src/
  app/
    login/ claim/ status/ auth/        # auth flow
    (app)/                             # gated app shell (top bar + bottom nav)
      dashboard/ skills/ homework/ materials/
      practice/ ranking/ progress/ students/
      admin/ feedback/ placement/ account/
    api/ai/chat/  api/telegram/        # AI + Telegram endpoints
  components/                          # UI, app-shell, AI launcher
  lib/                                 # supabase clients, dal, gemini, telegram, types
  proxy.ts                             # Next.js 16 proxy (session refresh + gating)
supabase/schema.sql                    # full DB: tables, RLS, functions, triggers, buckets
```

## Not in this version (v2)

Auto Click/Payme payments · AI auto-scoring · certificates · attendance · push notifications · phone-number **login** (the phone number is only collected).

## Security notes

- Every table has Row Level Security; helpers like `is_admin()`/`has_active_access()` are `SECURITY DEFINER` to avoid RLS recursion.
- Storage buckets are private: `materials/<level>/…` (staff write, students read their level) and `submissions/<uid>/…` (each student their own folder).
- The service-role key is used only server-side (Telegram webhook). Never exposed to the browser.
