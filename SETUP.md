# Maga Academy — Setup guide (for beginners)

Follow these steps in order. Total time: ~30–40 minutes. You do **not** need to write any SQL by hand beyond pasting one file.

The app is **Next.js + Supabase + Gemini + Telegram**, deployed on **Vercel**.

---

## 0. Install the basics (once)

- Install **Node.js 20 or newer** from <https://nodejs.org>.
- Open a terminal in this project folder (`maga-academy`).

```bash
npm install
```

---

## 1. Create the Supabase project + run the schema

1. Go to <https://supabase.com> → **New project**. Pick a name, a strong database password, and a region close to your students. Wait ~2 minutes for it to be ready.
2. In the left menu open **SQL Editor → New query**.
3. Open the file **`supabase/schema.sql`** from this project, copy **everything**, paste it into the editor, and press **Run**.
   - This creates all tables, security rules (RLS), the `claim_role`/`get_leaderboard`/`student_progress`/`touch_streak` functions, the triggers, and the two storage buckets (`materials`, `submissions`). It is safe to run again later.
4. Open **Project Settings → API** and copy these three values (you'll paste them in step 5):
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

> Your project ref is the `xxxx` in `https://xxxx.supabase.co`. You'll need it for Google.

---

## 2. Turn OFF "Confirm email"

1. Supabase → **Authentication → Sign In / Providers → Email**.
2. **Disable "Confirm email"** and save. (So the owner never gets stuck on forgotten confirmation links — sign-in just works.)

---

## 3. Enable Google sign-in (the main way to log in)

**A) Create a Google OAuth client**

1. Go to <https://console.cloud.google.com> → create/select a project.
2. **APIs & Services → OAuth consent screen** → choose **External** → fill the app name + your email → Save. (Add yourself under **Test users** if it asks.)
3. **APIs & Services → Credentials → Create credentials → OAuth client ID → Web application**.
4. Under **Authorized redirect URIs** add exactly:
   ```
   https://<your-ref>.supabase.co/auth/v1/callback
   ```
   (replace `<your-ref>`).
5. Create it and copy the **Client ID** and **Client secret**.

**B) Tell Supabase about it**

1. Supabase → **Authentication → Sign In / Providers → Google** → enable it.
2. Paste the **Client ID** and **Client secret** → Save.

**C) Set your URLs**

1. Supabase → **Authentication → URL Configuration**.
2. **Site URL**: `http://localhost:3000` for now (change to your Vercel URL after deploying).
3. **Redirect URLs**: add both
   ```
   http://localhost:3000/**
   https://<your-vercel-domain>/**
   ```
   (the second one after you deploy in step 7).

---

## 4. Telegram bot (complaints, feedback, placement results)

1. In Telegram, open **@BotFather** → `/newbot` → choose a name and username → copy the **bot token** → `TELEGRAM_BOT_TOKEN`.
2. Open **@userinfobot** and press start → it shows your numeric **Id** → that's `TELEGRAM_CHAT_ID` (the centre's chat that receives messages). For a group, add the bot to the group and use the group's id.
3. Choose any long random string for `TELEGRAM_WEBHOOK_SECRET` (e.g. mash the keyboard).
4. **After deploying (step 7)**, register the webhook by opening this URL in your browser (replace the parts):
   ```
   https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=https://<your-vercel-domain>/api/telegram&secret_token=<TELEGRAM_WEBHOOK_SECRET>
   ```
   You should see `{"ok":true,...}`.

---

## 5. Get a free Gemini API key (the AI tutor "Maga")

1. Go to <https://aistudio.google.com/app/apikey> → **Create API key**.
2. Copy it → `GEMINI_API_KEY`. (Leave `GEMINI_MODEL=gemini-2.0-flash`.)

> Without this key the app still runs — the AI tutor just shows a polite "not configured yet" message.

---

## 6. Fill in `.env.local` and run locally

1. Copy `.env.example` to `.env.local` (a placeholder `.env.local` already exists — just replace the values):

   ```bash
   cp .env.example .env.local
   ```

2. Put your real values in `.env.local`:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<your-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   GEMINI_API_KEY=...
   GEMINI_MODEL=gemini-2.0-flash
   TELEGRAM_BOT_TOKEN=...
   TELEGRAM_CHAT_ID=...
   TELEGRAM_WEBHOOK_SECRET=...
   ```

3. Run it:

   ```bash
   npm run dev
   ```

   Open <http://localhost:3000>.

### First login (no SQL needed!)

1. Click **Continue with Google** and sign in.
2. You'll land on **/claim**. Type **`99maga00`** → you are now the **admin**.
3. Give the other codes to your people:
   - **`askelad`** → teacher (active immediately)
   - **`kuroku`** → student (or tick **"I am a parent"** → parent). Students/parents start **pending** until you approve them in **Manage → Approvals & access**.

> The codes live **only inside the database function** `claim_role`, so nobody can promote themselves by editing the app. You can change the codes by editing that function in `supabase/schema.sql` and re-running it.

---

## 7. Deploy to Vercel

1. Push this project to GitHub.
2. Go to <https://vercel.com> → **Add New → Project** → import the repo. Framework auto-detects **Next.js**. Click **Deploy**.
3. In Vercel → **Project → Settings → Environment Variables**, add **the same variables** from your `.env.local`, **except** set:
   ```
   NEXT_PUBLIC_SITE_URL=https://<your-vercel-domain>
   ```
   Then **Redeploy**.
4. Go back and finish the URL bits you deferred:
   - **Supabase → URL Configuration**: set **Site URL** to your Vercel URL and make sure `https://<your-vercel-domain>/**` is in Redirect URLs.
   - **Google Cloud → Credentials**: the redirect URI stays the Supabase one (`https://<ref>.supabase.co/auth/v1/callback`) — no change needed.
   - **Telegram**: run the `setWebhook` URL from step 4 with your Vercel domain.

Done 🎉 — open your Vercel URL, sign in with Google, type `99maga00`, and run your academy.

---

## Daily workflow (admin)

1. **Manage → Groups**: create a group (e.g. "Grade 10-A"), pick its level, assign a teacher.
2. **Manage → Approvals & access**: approve new students/parents (defaults to **+30 days**; auto-locks after that until you renew).
3. **Manage → Users, levels & links**: set each student's level, and link a parent to their child (the parent unlocks automatically once the child is active).
4. Add students to a group from **Groups**. From then on everything (homework, materials, ranking, parent view) flows automatically for that group.

## Roles at a glance

| Role | Code | Starts as | Can do |
|------|------|-----------|--------|
| Admin | `99maga00` | active | Everything: approvals, groups, levels, links, feedback |
| Teacher | `askelad` | active | Materials, homework, grading, ranking, students |
| Student | `kuroku` | pending | Skills, homework, practice, ranking, progress, AI tutor, placement |
| Parent | `kuroku` + ☑ parent | pending | Read-only child progress, message the centre, AI tutor |

## Troubleshooting

- **Google login loops back to /login** → check the redirect URI in Google matches `https://<ref>.supabase.co/auth/v1/callback`, and that your Vercel domain is in Supabase **Redirect URLs**.
- **"Invalid code" on /claim** → the code is wrong; the defaults are `99maga00`, `askelad`, `kuroku`.
- **AI tutor says "not configured"** → add `GEMINI_API_KEY` and redeploy.
- **Telegram silent** → re-run `setWebhook`; confirm `TELEGRAM_CHAT_ID` is your numeric id and the secret matches.
