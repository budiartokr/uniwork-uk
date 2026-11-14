# UniWorks

From your first week to your Graduate visa: visa-safe part-time jobs, money and next steps for international students in the UK. Built by Global Talent Education.

A static site (`index.html`) with one Vercel function (`api/jobs.js`) and a Supabase backend (`supabase/`).

## Deploy (Vercel)

1. Import this repo in Vercel. Framework preset: **Other**. No build command, output directory is the repo root.
2. Optional environment variables for the live job feed (Settings → Environment Variables):
   `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`, `REED_API_KEY`. Without them the app shows the job snapshot built into `index.html`.
3. Every push to `main` deploys automatically.

## Backend (Supabase project `jxnhqoplagcptgqtlkcs`)

- Schema: `supabase.sql`. Edge function: `supabase/functions/uniwork/index.ts` (deployed with `verify_jwt` off).
- Email reminders need the secrets `RESEND_API_KEY` and `MAIL_FROM` (Supabase → Edge Functions → Secrets). Never commit keys to this repo.

## Home screen app

`manifest.webmanifest`, `sw.js` and `icons/` make the site installable. It works on the live domain over HTTPS, not in previews. Bump `VERSION` in `sw.js` to clear old caches after a big change.

## Owner numbers

Open `/#stats` on the live site and enter the admin key stored in Supabase table `app_config`.
