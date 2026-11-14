# UniWorks

From your first week to your Graduate visa: visa-safe part-time jobs, money and next steps for international students in the UK. Built by Global Talent Education.

Live: **https://www.getuniworks.co.uk** — hosted on **Hostinger** (Business plan, website `getuniworks.co.uk`, folder `public_html`). A static site (`index.html` plus files) with a Supabase backend (`supabase/`). No build step.

## Update the website (Hostinger, by hand)

1. Back up first: hPanel → Websites → getuniworks.co.uk → File Manager → `public_html`, select all, **Compress** to a zip and download it.
2. Upload the new zip (for example `UniWorks-hostinger.zip`) into `public_html`.
3. Right-click the zip → **Extract** into `public_html` and choose to **overwrite** existing files. Then delete the zip.
4. Open https://www.getuniworks.co.uk and refresh. If a change does not show, refresh again after a minute (the Hostinger CDN can keep a copy briefly; hPanel → Performance → CDN → Flush cache clears it).

What goes in `public_html` (and in every update zip, at the top level, not inside a folder):
`index.html`, `manifest.webmanifest`, `sw.js`, `robots.txt`, `sitemap.xml`, `.htaccess`, and the folders `brand/`, `icons/`, `images/`, `fonts/`, `data/`.
Most updates only change `index.html`. After a big change, also bump `VERSION` in `sw.js` so phones with the app installed pick up the new version.

`.htaccess` holds the server rules (https and www redirect, cache rules, service-worker header). Keep it; File Manager hides it unless "show hidden files" is on.

Do not put `supabase/`, `api/`, `vercel.json`, `README.md`, `BRAND.md` or `supabase.sql` on Hostinger: they are source files, not part of the website.

## Backend (Supabase project `jxnhqoplagcptgqtlkcs`, Frankfurt)

- Schema: `supabase.sql`. Edge function: `supabase/functions/uniwork/index.ts` (deployed with `verify_jwt` off). It handles tracking, accounts, mentor requests, email reminders, exchange rates and the **live job feed** (`/jobs`).
- Secrets (Supabase → Edge Functions → Secrets), never in this repo:
  - Email: `RESEND_API_KEY`, `MAIL_FROM`, optional `MENTOR_INBOX`.
  - Live jobs: `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`, `REED_API_KEY`. Without them the site shows the job snapshot built into `index.html`.

## Old address

`uniwork-uk.vercel.app` still exists on Vercel only to redirect visitors to the new domain (`vercel.json`). `api/jobs.js` is the old Vercel job function, kept for reference; the live site uses Supabase `/jobs`.

## Home screen app

`manifest.webmanifest`, `sw.js` and `icons/` make the site installable on phones. Works on the live domain over HTTPS.

## Owner numbers

Open https://www.getuniworks.co.uk/#stats and enter the admin key stored in Supabase table `app_config`. First-visit preview: https://www.getuniworks.co.uk/#first-visit
