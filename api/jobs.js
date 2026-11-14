// UniWorks: live part-time jobs from Adzuna and Reed, merged into one list.
// Runs as a Vercel serverless function at /api/jobs (Node 18+, built-in fetch).
// Set these environment variables in Vercel (Settings > Environment Variables):
//   ADZUNA_APP_ID, ADZUNA_APP_KEY, REED_API_KEY
// Query: /api/jobs?city=Leeds&q=barista   (city defaults to all 10 cities)

const CITIES = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Edinburgh', 'Glasgow', 'Bristol', 'Liverpool', 'Cardiff', 'Belfast'];
const PER_CITY = 20;

// Rough category from the job title, matching the website's filters.
function category(title) {
  const t = title.toLowerCase();
  if (/student union|students' union|campus|ambassador|notetaker|library/.test(t)) return 'oncampus';
  if (/tutor|teaching|invigilat|cover supervisor|learning support|education/.test(t)) return 'tutoring';
  if (/care|support worker|nursery|housekeep|health/.test(t)) return 'care';
  if (/warehouse|picker|packer|delivery|driver|logistics|parcel/.test(t)) return 'logistics';
  if (/event|steward|catering|banquet/.test(t)) return 'events';
  if (/barista|waiter|waitress|kitchen|chef|bar staff|bartender|hotel|restaurant|cafe|food|hospitality/.test(t)) return 'food';
  if (/admin|receptionist|customer service|call centre|office|data entry|accounts/.test(t)) return 'admin';
  return 'retail';
}

const money = (n) => '£' + Number(n).toLocaleString('en-GB', { maximumFractionDigits: 2 });

// Reed and Adzuna give a bare min/max. Small numbers are hourly, large ones yearly.
function pay(min, max) {
  if (!min && !max) return 'Salary not specified';
  const lo = min || max, hi = max || min;
  const unit = hi < 100 ? ' per hour' : (hi < 1000 ? ' per day' : ' per annum');
  return (lo === hi ? money(lo) : money(lo) + ' - ' + money(hi)) + unit;
}

function ago(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return '';
  const days = Math.floor((Date.now() - d.getTime()) / 864e5);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 14) return days + ' days ago';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
}

async function adzuna(city, q) {
  const id = process.env.ADZUNA_APP_ID, key = process.env.ADZUNA_APP_KEY;
  if (!id || !key) return [];
  const u = new URL('https://api.adzuna.com/v1/api/jobs/gb/search/1');
  u.search = new URLSearchParams({
    app_id: id, app_key: key, where: city, what: q || 'part time',
    part_time: '1', results_per_page: String(PER_CITY), sort_by: 'date', 'content-type': 'application/json'
  }).toString();
  const r = await fetch(u);
  if (!r.ok) throw new Error('Adzuna ' + r.status);
  const data = await r.json();
  return (data.results || []).map((j) => [
    'az' + j.id, j.title, (j.company && j.company.display_name) || 'Employer not named',
    (j.location && j.location.display_name) || city, pay(j.salary_min, j.salary_max),
    [j.contract_type, j.contract_time].filter(Boolean).join(', ').replace(/_/g, '-') || 'Part-time',
    ago(j.created), city, category(j.title), j.redirect_url, 'adzuna'
  ]);
}

async function reed(city, q) {
  const key = process.env.REED_API_KEY;
  if (!key) return [];
  const u = new URL('https://www.reed.co.uk/api/1.0/search');
  u.search = new URLSearchParams({
    keywords: q || '', locationName: city, distanceFromLocation: '10', partTime: 'true', resultsToTake: String(PER_CITY)
  }).toString();
  // Reed: the API key is the Basic auth username, with an empty password.
  const auth = 'Basic ' + Buffer.from(key + ':').toString('base64');
  const r = await fetch(u, { headers: { Authorization: auth } });
  if (!r.ok) throw new Error('Reed ' + r.status);
  const data = await r.json();
  return (data.results || []).map((j) => {
    const [dd, mm, yy] = String(j.date || '').split('/');
    return [
      'rd' + j.jobId, j.jobTitle, j.employerName || 'Employer not named', j.locationName || city,
      pay(j.minimumSalary, j.maximumSalary), 'Part-time', yy ? ago(`${yy}-${mm}-${dd}`) : '',
      city, category(j.jobTitle || ''), j.jobUrl || ('https://www.reed.co.uk/jobs/' + j.jobId), 'reedlive'
    ];
  });
}

export default async function handler(req, res) {
  const city = CITIES.includes(req.query.city) ? req.query.city : null;
  const q = String(req.query.q || '').slice(0, 60);
  const cities = city ? [city] : CITIES;
  const jobs = [], errors = [];
  await Promise.all(cities.flatMap((c) => [adzuna, reed].map((fn) =>
    fn(c, q).then((list) => jobs.push(...list)).catch((e) => errors.push(e.message))
  )));
  // Same job on both sites: keep the first one seen.
  const seen = new Set();
  const unique = jobs.filter((j) => {
    const k = (j[1] + '|' + j[2]).toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  // Cache at Vercel's edge for an hour, so API limits are not hit on every visit.
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  res.status(200).json({ updated: new Date().toISOString(), count: unique.length, errors: [...new Set(errors)], jobs: unique });
}
