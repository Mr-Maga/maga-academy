# Maga Academy — ideas & roadmap (shared)

This is our shared backlog. Add anything you want here ("add X to page Y", "Z isn't great"), and I'll pick it up and build it. Tick things off as we ship them.

## ✅ Done
- Auth (Google + email), one-time role codes, access gating
- Admin: approvals, groups, levels, parent links
- Homework (assign / submit / grade / red flag), Materials, Skills
- Practice Lab (typing + shadowing + streak), Ranking, Progress, Parent portal
- Feedback (web + Telegram) + AI summary for staff
- **AI tutor "Maga"** — now context-aware (knows the learner's level, weakest skill, streak, homework %, and academy prices/schedule)
- **AI Writing check** — instant IELTS band across the 4 criteria + strengths + improvements + a one-band-higher model answer
- **AI Speaking examiner** — Part 1/2/3 bank, record-and-transcribe (voice → text), band score + model answer
- Placement test

## 🔜 Proposed next (my suggestions)
1. **Save AI evaluations** — store Writing/Speaking band results in the DB so students see history and teachers can review (a `evaluations` table).
2. **AI tutor → tutor menu** — quick buttons in the chat ("Check my writing", "Practice speaking", "Explain a grammar rule").
3. **Audio playback for speaking** — keep the recording so the student can listen back while reading the AI feedback.
4. **Teacher: "AI second opinion"** — on a homework submission, a button that runs the AI evaluator to help the teacher grade faster.
5. **Suggestions board for admin** — a dedicated view that pulls only improvement ideas out of feedback (separate `kind = 'suggestion'`).
6. **Editable academy info in-app** — let the admin edit prices/schedule from the app instead of `src/lib/academy.ts`.
7. **Notifications dot** — show unread counts on Homework / Feedback in the bottom nav.

## 📝 Your ideas (add freely)
- …

---
**How to use:** jot an idea under "Your ideas" (or just tell me in chat). I'll turn it into a built, tested change.
