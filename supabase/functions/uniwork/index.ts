// UniWorks backend: one public Edge Function with several actions.
// POST /uniwork/track    {type, partner?, sid?, page?}       product events, fake-door and partner clicks
// POST /uniwork/account  {name, email, country, university, city, courseEnd?, courseStart?, flyDate?, consent, source?}
//                        needs at least one of courseEnd (YYYY-MM), courseStart or flyDate (YYYY-MM-DD)
// POST /uniwork/mentor   {name, email, country, university, city, topic, language, times, notes}
//                        a topic that starts with "Waitlist:" is a waitlist place, not a session request
// GET  /uniwork/verify?token=   confirms an email
// GET  /uniwork/unsubscribe?token=   stops reminder emails
// GET  /uniwork/stats?key=   owner numbers (key is in table app_config, row admin_key)
// GET  /uniwork/fx       exchange rates per £1 (cached 6 hours)
// POST /uniwork/reminders   daily, called by pg_cron with header x-cron-secret
// Optional secrets for email: RESEND_API_KEY, MAIL_FROM, MENTOR_INBOX

const SB = Deno.env.get('SUPABASE_URL')!;
const KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const FN = `${SB}/functions/v1/uniwork`;
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'content-type, x-cron-secret', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS' };
const TYPES = new Set(['session', 'offer_open', 'checkout_click', 'partner_click', 'mentor_open', 'signup_open', 'alert_signup', 'pack_unlock', 'ai_limit', 'mentor_waitlist',
  'nav_click', 'help_open', 'setup_done', 'return_visit', 'email_capture', 'install_open', 'install_done']);

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
const page = (msg: string, status = 200) => new Response(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>UniWorks</title><body style="font-family:system-ui;max-width:520px;margin:15vh auto;padding:0 20px;color:#14174F"><h1 style="color:#1E4ADD">UniWorks</h1><p style="font-size:18px">${msg}</p></body>`, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
const clean = (v: unknown, max = 200) => String(v ?? '').replace(/[<>]/g, '').trim().slice(0, max);
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const isDay = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !isNaN(Date.parse(v + 'T00:00:00Z'));
const h = (extra: Record<string, string> = {}) => ({ apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', ...extra });

async function rest(path: string, init: RequestInit = {}) {
  const r = await fetch(`${SB}/rest/v1/${path}`, { ...init, headers: { ...h(), ...(init.headers as Record<string, string> || {}) } });
  if (!r.ok) throw new Error(`${path} ${r.status} ${await r.text()}`);
  const t = await r.text();
  return t ? JSON.parse(t) : null;
}
async function count(table: string, filter = '') {
  const r = await fetch(`${SB}/rest/v1/${table}?select=*${filter ? '&' + filter : ''}`, { method: 'HEAD', headers: h({ Prefer: 'count=exact', Range: '0-0' }) });
  return Number((r.headers.get('content-range') || '*/0').split('/')[1]) || 0;
}
async function config(key: string) {
  const rows = await rest(`app_config?select=value&key=eq.${key}`);
  return rows?.[0]?.value as string | undefined;
}
async function sendEmail(to: string, subject: string, html: string) {
  const k = Deno.env.get('RESEND_API_KEY'), from = Deno.env.get('MAIL_FROM');
  if (!k || !from) return false;
  const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${k}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from, to: [to], subject, html }) });
  return r.ok;
}

let fxCache: { at: number; body: unknown } | null = null;
async function fx() {
  if (fxCache && Date.now() - fxCache.at < 6 * 3600e3) return fxCache.body;
  const r = await fetch('https://open.er-api.com/v6/latest/GBP');
  const d = await r.json();
  if (d.result !== 'success') throw new Error('fx');
  const body = { base: 'GBP', rates: d.rates, updated: d.time_last_update_utc, source: 'ExchangeRate-API (open.er-api.com)' };
  fxCache = { at: Date.now(), body };
  return body;
}

const addMonths = (d: Date, n: number) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1));
const fmt = (d: Date) => d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const fmtDay = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
type Due = { kind: string; at: Date; subject: string; body: string };
type Acc = { course_end: string | null; course_start: string | null; fly_date: string | null };

function due(a: Acc, today: Date) {
  const list: Due[] = [];
  if (a.course_end) {
    const end = new Date(a.course_end + 'T00:00:00Z');
    const cut = new Date(Date.UTC(2027, 0, 1));
    const gradMonths = end < cut ? 24 : 18;
    list.push(
      { kind: 'sponsor-search', at: addMonths(end, -9), subject: 'Start your sponsored job search', body: `Your course ends in ${fmt(end)}. Graduate schemes open now: check each employer with the Company check in UniWorks before you apply.` },
      { kind: 'graduate-visa-prepare', at: addMonths(end, -1), subject: 'Get ready for your Graduate visa', body: 'Apply from the UK before your Student visa expires, once your university reports that you completed your course.' },
      { kind: 'sponsor-offer', at: addMonths(end, gradMonths - 4), subject: 'Four months left to secure a sponsored offer', body: 'Your Graduate visa ends in about four months. Use the Salary check to confirm an offer meets the new entrant rate.' }
    );
    if (end < cut && today >= new Date(Date.UTC(2026, 11, 1)) && today < cut) {
      list.push({ kind: 'apply-by-31-dec-2026', at: new Date(Date.UTC(2026, 11, 1)), subject: 'Apply by 31 December 2026 for a 2-year Graduate visa', body: 'Graduate visa applications made on or before 31 December 2026 get 2 years. From 1 January 2027 they get 18 months.' });
    }
  }
  if (a.course_start) {
    const start = new Date(a.course_start + 'T00:00:00Z');
    const open = new Date(start); open.setUTCMonth(open.getUTCMonth() - 6);
    list.push({ kind: 'visa-window-open', at: open, subject: 'You can now apply for your Student visa', body: `Your course starts on ${fmtDay(start)}. Applications open 6 months before, so you can apply now. Have your CAS, passport and money evidence ready: your Before you fly plan in UniWorks lists them.` });
  }
  if (a.fly_date) {
    const fly = new Date(a.fly_date + 'T00:00:00Z');
    const week = new Date(fly.getTime() - 7 * 864e5);
    list.push({ kind: 'fly-week', at: week, subject: 'One week until you fly', body: `You fly on ${fmtDay(fly)}. Check your eVisa matches your airline booking and put your documents in your hand luggage. Your Before you fly plan in UniWorks has the full list.` });
  }
  const from = new Date(today.getTime() - 30 * 864e5);
  return list.filter((r) => r.at <= today && r.at >= from);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  const url = new URL(req.url);
  const action = url.pathname.split('/').filter(Boolean).pop();
  try {
    if (action === 'track' && req.method === 'POST') {
      const b = await req.json().catch(() => ({}));
      const type = clean(b.type, 40);
      if (!TYPES.has(type)) return json({ error: 'Unknown event type' }, 400);
      await rest('events', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ type, partner: clean(b.partner, 40) || null, sid: clean(b.sid, 64) || null, page: clean(b.page, 40) || null }) });
      return json({ ok: true });
    }
    if (action === 'account' && req.method === 'POST') {
      const b = await req.json().catch(() => ({}));
      const email = clean(b.email).toLowerCase();
      if (!isEmail(email)) return json({ error: 'Enter a valid email address.' }, 400);
      const m = /^(\d{4})-(\d{2})$/.exec(clean(b.courseEnd, 7));
      const courseStart = clean(b.courseStart, 10), flyDate = clean(b.flyDate, 10);
      if (!m && !isDay(courseStart) && !isDay(flyDate)) return json({ error: 'Choose the month your course ends.' }, 400);
      const consent = b.consent === true;
      // Only the fields this form sent, so a second sign-up never wipes dates saved by the first
      const fields: Record<string, unknown> = { email, consent, updated_at: new Date().toISOString() };
      for (const [k, v, max] of [['name', b.name, 120], ['country', b.country, 60], ['university', b.university, 160], ['city', b.city, 60], ['source', b.source, 40]] as [string, unknown, number][]) {
        const c = clean(v, max); if (c) fields[k] = c;
      }
      if (m) fields.course_end = `${m[1]}-${m[2]}-01`;
      if (isDay(courseStart)) fields.course_start = courseStart;
      if (isDay(flyDate)) fields.fly_date = flyDate;
      const existing = await rest(`accounts?select=email,token,verified&email=eq.${encodeURIComponent(email)}`);
      let token: string, verified = false;
      if (existing?.length) {
        token = existing[0].token || crypto.randomUUID();
        verified = existing[0].verified === true;
        await rest(`accounts?email=eq.${encodeURIComponent(email)}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ ...fields, token }) });
      } else {
        token = crypto.randomUUID();
        await rest('accounts', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ ...fields, token, verified: false }) });
      }
      let sent = false;
      if (consent && !verified) {
        sent = await sendEmail(email, 'Confirm your UniWorks reminders', `<p>Hi ${clean(b.name, 60) || 'there'},</p><p>Confirm your email so UniWorks can remind you before your visa deadlines.</p><p><a href="${FN}/verify?token=${token}">Confirm my email</a></p><p>If you didn’t sign up, ignore this email.</p>`);
      }
      return json({ ok: true, confirmSent: sent, verified });
    }
    if (action === 'mentor' && req.method === 'POST') {
      const b = await req.json().catch(() => ({}));
      const email = clean(b.email).toLowerCase();
      if (!isEmail(email)) return json({ error: 'Enter a valid email address.' }, 400);
      const row = { name: clean(b.name, 120), email, country: clean(b.country, 60), university: clean(b.university, 160), city: clean(b.city, 60), topic: clean(b.topic, 120), language: clean(b.language, 40), times: clean(b.times, 300), notes: clean(b.notes, 1000) };
      await rest('mentor_requests', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(row) });
      const waitlist = /^Waitlist:/i.test(row.topic);
      const inbox = Deno.env.get('MENTOR_INBOX');
      if (inbox) await sendEmail(inbox, `${waitlist ? 'Mentor waitlist' : 'New mentor request'}: ${row.name} (${row.country})`, `<p>${row.name} &lt;${row.email}&gt;, ${row.university}</p><p>Topic: ${row.topic}<br>Language: ${row.language}<br>Times: ${row.times}</p><p>${row.notes}</p>`);
      if (waitlist) {
        await sendEmail(email, 'You are on the UniWorks mentor waitlist', `<p>Hi ${row.name || 'there'},</p><p>Thanks for joining the mentor waitlist for ${row.country || 'your country'}. We will email you as soon as a mentor from ${row.country || 'your country'} joins. You pay nothing until a session is booked.</p>`);
      } else {
        await sendEmail(email, 'We received your UniWorks mentor request', `<p>Hi ${row.name || 'there'},</p><p>Thanks for requesting a 45-minute mentor session (£15). We will email you a mentor, a time and a payment link within 2 working days.</p>`);
      }
      return json({ ok: true });
    }
    if (action === 'verify') {
      const token = clean(url.searchParams.get('token'), 64);
      if (!token) return page('This link is not valid.', 400);
      const rows = await rest(`accounts?token=eq.${encodeURIComponent(token)}`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ verified: true }) });
      return rows?.length ? page('Your email is confirmed. We will remind you before your visa deadlines.') : page('This link has expired. Sign up again in UniWorks.', 404);
    }
    if (action === 'unsubscribe') {
      const token = clean(url.searchParams.get('token'), 64);
      if (!token) return page('This link is not valid.', 400);
      await rest(`accounts?token=eq.${encodeURIComponent(token)}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ consent: false }) });
      return page('You will not get any more reminder emails from UniWorks.');
    }
    if (action === 'fx') return json(await fx());
    if (action === 'stats') {
      const admin = await config('admin_key');
      if (!admin || url.searchParams.get('key') !== admin) return json({ error: 'Wrong key' }, 401);
      const counts: Record<string, number> = {};
      for (const t of TYPES) counts[t] = await count('events', `type=eq.${t}`);
      const partners: Record<string, number> = {}, places: Record<string, number> = {}, navs: Record<string, number> = {};
      const clicks = await rest('events?select=partner,page&type=eq.partner_click&limit=20000') || [];
      clicks.forEach((r: { partner: string; page: string }) => { if (!r.partner) return; partners[r.partner] = (partners[r.partner] || 0) + 1; const k = r.partner + ' @ ' + (r.page || '?'); places[k] = (places[k] || 0) + 1; });
      const tabs = await rest('events?select=page&type=eq.nav_click&limit=20000') || [];
      tabs.forEach((r: { page: string }) => { if (r.page) navs[r.page] = (navs[r.page] || 0) + 1; });
      return json({ source: 'live', counts, partners, places, navs, accounts: await count('accounts'), verified: await count('accounts', 'verified=is.true'), mentor: await count('mentor_requests') });
    }
    if (action === 'reminders' && req.method === 'POST') {
      const secret = await config('cron_secret');
      if (!secret || req.headers.get('x-cron-secret') !== secret) return json({ error: 'Forbidden' }, 401);
      const today = new Date();
      const accounts = await rest('accounts?select=email,name,course_end,course_start,fly_date,token&verified=is.true&consent=is.true&limit=10000') || [];
      const sent = await rest('reminders_sent?select=email,kind&limit=100000') || [];
      const done = new Set(sent.map((r: { email: string; kind: string }) => r.email + '|' + r.kind));
      let n = 0;
      for (const a of accounts) {
        for (const r of due(a, today)) {
          if (done.has(a.email + '|' + r.kind)) continue;
          const ok = await sendEmail(a.email, r.subject, `<p>Hi ${a.name || 'there'},</p><p>${r.body}</p><p style="font-size:12px">General information, not immigration advice. <a href="${FN}/unsubscribe?token=${a.token}">Stop these emails</a></p>`);
          if (ok) { await rest('reminders_sent', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ email: a.email, kind: r.kind }) }); n += 1; }
        }
      }
      return json({ ok: true, sent: n });
    }
    return json({ error: 'Not found' }, 404);
  } catch (e) {
    console.error(action, e);
    return json({ error: 'Something went wrong. Try again.' }, 500);
  }
});
