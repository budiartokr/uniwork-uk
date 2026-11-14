# UniWorks: brand guidelines (v1.1)

Baseline taken from the live site (www.getuniworks.co.uk, repo `budiartokr/uniwork-uk`). Renamed from "UniWork UK" to **UniWorks** on 14 Nov 2026. This document records how the brand looks and sounds today, so new pages, social posts and marketing stay consistent. **Change the site and this document together.**

---

## 1. Brand core

| | |
|---|---|
| **Name** | **UniWorks**: one word, capital U and capital W, always with the "s". Domain: **getuniworks.co.uk**. Never "UniWork", "Uniworks", "Uni Works", "UNIWORKS" or "UniWorks UK" (the UK flag in the logo already says UK). |
| **Owner** | Built by **Global Talent Education**. Say "Built by Global Talent Education" or "By Global Talent Education"; avoid the bare "GTE" in customer-facing copy. |
| **Audience** | International students in the UK, from pre-departure to the Graduate route and a work visa. |
| **Brand promise** | **Work in the UK, the visa-safe way.** |
| **Tagline** | **Arrive. Work. Save. Stay.** (the four stages of the student journey, in order) |
| **One-line description** | From your first week to the Graduate route: visa-safe work, money and next steps for international students. |
| **Page title pattern** | `UniWorks: work and stay in the UK, the visa-safe way` |
| **Meta description** | Arrival plan, visa-checked part-time jobs, budget and visa sponsors for international students in the UK. |

### What the brand stands for
1. **Visa-safe first.** Every job, check and tip is filtered by what a Student visa allows.
2. **Checked, with a date.** Rules are checked against GOV.UK, and the page says when.
3. **Free to start.** The core checks work with no account.
4. **People who made the same move.** Global Talent Education is a team of international students and graduates.
5. **Honest limits.** UniWorks gives general information, not immigration, tax or legal advice.

### Proof points (approved, keep numbers current)
- `N` visa-checked part-time jobs (live count)
- 128,000+ licensed visa sponsors
- Rules checked against GOV.UK
- Free, no account needed
- By Global Talent Education

### The journey (navigation names)
| Stage | Desktop label | Mobile label |
|---|---|---|
| Personal hub | My plan | Plan |
| 1 | Before you fly | Prepare |
| 2 | Arrive | Arrive |
| 3 | Part-time jobs | Jobs |
| 4 | Money | Money |
| 5 | After graduation | After uni |

---

## 2. Logo

**Wordmark:** "UniWorks" set in **Unbounded ExtraBold (800)**, letter-spacing −0.02em, converted to outlines (no font needed to display it). Unbounded is wide and geometric: distinctive, but firm and easy to read at small sizes.
**UK flag:** a Union Jack with rounded corners at the end of the wordmark, sitting on the baseline, 72% of the capital height, with a gap of about one-seventh of the capital height. The flag keeps its official colours (`#012169`, `#C8102E`, white) on every background.

| File (in `brand/`) | Use |
|---|---|
| `uniworks-logo-blue.svg` | Default on white or Mist (wordmark `#1E4ADD`) |
| `uniworks-logo-white.svg` | On Visa Blue, Night Navy or photos with a dark overlay |
| `uniworks-logo-navy.svg` | One-colour print on light paper (wordmark `#14174F`) |
| `uniworks-icon.svg` | App icon and avatar: white Unbounded "U" on Visa Blue with the flag underneath |
| `favicon.svg` | Browser tab (rounded version of the icon) |

| Rule | Value |
|---|---|
| Header | Height 26 px (18 px under 420 px, 15 px under 360 px) |
| Footer | Height 30 px, white version |
| Social share image | `images/share.png`, 1200×630, white logo on Visa Blue |
| Minimum size | 15 px high on screen; below that, use the icon |
| Clear space | At least the height of the "U" on every side |
| Don't | Retype the name in another font, recolour the flag, put the flag before the name, stretch, add shadows or outlines, or place it on busy photos |

The old graduation-cap mark is retired.

---|---|
| Header | Mark 32 px, wordmark 21 px, gap 10 px |
| Footer | Mark 36 px, wordmark 24 px, white wordmark |
| Small screens (≤420 px) | Mark 26 px, wordmark 18 px, gap 6 px |
| On navy or blue | Wordmark in white; the mark keeps its colours |
| Clear space | At least half the mark's width on every side |
| Don't | Recolour the mark, stretch it, add shadows or outlines, or place it on busy photos |

---

## 3. Colour

### Core palette
| Role | Name | Hex | Used for |
|---|---|---|---|
| Primary | **Visa Blue** | `#1E4ADD` | Wordmark, links, primary buttons, hero background, active states, `theme-color` |
| Accent | **Sun** | `#F8D93A` | Main call to action on blue/navy, highlight bars, focus ring, tagline accents, footer headings |
| Ink | **Night Navy** | `#14174F` | Body text, headings, footer background, dark panels |
| Deep ink | **Midnight** | `#0B1440` | Text on Sun, admin banners, deep shadows |
| Surface | **Mist** | `#F5F6FB` | Page background |
| Card | **White** | `#FFFFFF` | Cards, header, inputs |

### Supporting
| Name | Hex | Used for |
|---|---|---|
| Muted text | `#4A4F86` | Secondary text, notes, statuses |
| Line | `#E3E7F5` | Card borders, header divider |
| Line (strong) | `#DCE3F7` | Sub-navigation and mobile nav borders |
| Field border | `#B9C4F5` | Inputs and selects |
| Tint blue | `#EEF1FD` / `#F4F6FE` | Sub-navigation strip, soft panels |
| On-dark soft text | `#DCE3FF` | Supporting text on blue/navy (footer body, eyebrows) |

### Status (meaning only, never decoration)
| Meaning | Text | Background |
|---|---|---|
| Safe / allowed | `#14653F` | `#DDF6E8` (strong green `#1F8A5B`) |
| Warning / check | `#7A5300` / `#3D2A00` | `#FFF3CC` or `#FFE7A3` (border `#F2D27A`, strong `#E0A100`) |
| Not allowed / over limit | `#FFFFFF` on `#C0152F` | — |

### Proportion
Roughly **60% Mist/White, 30% Visa Blue/Night Navy, 10% Sun.** Sun is the spark: use it for the one action or phrase that matters most on a screen, not for large areas of body text.

### Contrast pairs
- Approved: White on Visa Blue · White on Night Navy · Midnight on Sun · Night Navy on Mist/White · Sun on Night Navy.
- **Never** Sun text on white or Mist. **Never** Visa Blue text on Night Navy.

---

## 4. Typography

**Typeface: Geist** (Open Font License), self-hosted from `/fonts` in weights 400, 500, 600, 700, 800. Fallback: `system-ui, sans-serif`.

| Style | Weight | Size | Line height | Tracking |
|---|---|---|---|---|
| Display (hero, tagline) | 800 | `clamp(38px, 5vw, 74px)` | 0.94–1.0 | −0.035em |
| H2 section | 800 | `clamp(28px, 3.4vw, 46px)` | 1.04 | −0.03em |
| H2 panel | 800 | `clamp(24px, 2.6vw, 36px)` | 1.08 | −0.03em |
| Card title | 700–800 | 17–19 px | 1.3 | 0 |
| Body | 400–500 | 16 px (hero 17–19 px) | 1.5 | 0 |
| Small / meta | 500–600 | 13–15 px | 1.4 | 0 |
| Buttons | 600–700 | 14–16 px | — | 0 |

Rules:
- Sentence case everywhere ("Find part-time jobs", not "Find Part-Time Jobs").
- Avoid ALL-CAPS; the only exception is the short uppercase eyebrow on feature panels (13 px, 0.08em tracking).
- Big statements are short: two to five words per line.

---

## 5. Signature graphic devices

1. **The tilted Sun bar.** The key phrase sits on a Sun block, rotated −1.5°, Midnight text, e.g. *Work in the UK* / **[the visa-safe way]**. Once per page at most.
2. **The four-word tagline** in display type, alternating white and Sun: **Arrive.** (white) **Work.** (Sun) **Save.** (white) **Stay.** (Sun). It closes every page in the footer.
3. **Hard "pop" shadow on buttons** instead of soft blur: on hover a button lifts 2 px and gets `0 8px 0 -2px` in navy (Sun buttons) or Sun (blue buttons).
4. **Tick lists** with a Sun ✓ on blue/navy for proof points.
5. **Numbered yellow dots** (34 px Sun circles, Midnight numbers) for step-by-step lists on navy panels.

---

## 6. Components

### Buttons
| Type | Style | Use |
|---|---|---|
| **Sun** (`.btn.sun`) | `#F8D93A` bg, `#14174F` text | Main action on blue/navy ("Find part-time jobs", "Book a free consultation") |
| **Blue** (`.btn.ind`) | `#1E4ADD` bg, white text | Main action on white/Mist ("Find jobs", "Get help") |
| **Outline** | white bg, `#1E4ADD` 2 px border and text | Secondary action on light backgrounds |
| **Ghost** | transparent, white 2 px border and text | Secondary action on blue/navy |
| **Pill chip** | radius 999 px, 2 px border | Quick checks, filters, field pickers |

All buttons: min-height **48 px** (header and footer 40–44 px), padding `0 24px`, radius **10 px**, weight 600–700. Labels say exactly what happens ("Find jobs", "Check this ad"), never "Submit" or "OK".

### Radius scale
`8px` small controls · `10px` buttons · `12px` inputs, small cards · `14–16px` cards and panels · `18px` feature panels · `999px` pills and chips.

### Shadows
Soft shadows are rare. Hero search card: `0 18px 40px -24px #0B1440`. Mobile bottom nav: `0 -8px 24px -18px #14174F`. Otherwise use a 1 px `#E3E7F5` border.

### Inputs
Height 48 px, radius 12 px, 2 px `#B9C4F5` border, focus border `#1E4ADD`. Always a visible label above the field; placeholders only for examples ("e.g. barista, retail, tutor").

### Footer (standard on every page)
Background Night Navy, padding `clamp(40px, 5vw, 64px)` top, max width 1280 px. Order:
1. **Brand block** (left, up to 330 px): white logo, promise "Work in the UK, the visa-safe way.", one-line description, "Built by Global Talent Education" (Sun link to globaltalent-education.com).
2. **Three link columns**, Sun headings (15 px, 800), white 15 px links that turn Sun and underline on hover:
   - *Your journey:* My plan · Before you fly · Arrive · Part-time jobs · Money · After graduation
   - *Visa tools:* Can I take this job? · Company check · Graduate visa timeline · Skilled Worker rules · Global Talent visa
   - *Help:* Get help · Find a mentor · Student deals · Jargon buster · Get the app on your phone · For employers
3. **Contact column:** email, UK office, Indonesia office, Sun button "Book a free consultation" (globaltalent-education.com). No phone number.
4. **Tagline** "Arrive. Work. Save. Stay." in display type.
5. **Legal line and "checked on" dates** (13 px, `#DCE3FF`).
6. **Bottom bar** above a `rgba(255,255,255,.18)` rule: "© 2026 Global Talent Education. All rights reserved." · Official sources: Student visa rules, Minimum wage, Right to work.

Layout: one row of five blocks on desktop; two link columns side by side on mobile, then Help and Contact stacked.

### Focus and accessibility
- Focus ring: `3px solid #F8D93A`, offset 2 px, on every interactive element.
- Touch targets ≥ 44 px.
- Respect `prefers-reduced-motion` (no lift animations).
- Layouts work from 360 px to 1440 px; mobile switches to a bottom navigation bar under 900 px.

### Layout
Max content width **1240–1280 px**, side padding `clamp(16px, 4vw, 56px)`, section padding `clamp(40px, 5vw, 72px)`.

---

## 7. Imagery

- Real photos of students (hero, duo, group, caller, laptop in `/images`, WebP).
- On the hero, photos fade into the blue with a gradient mask from the left and top, so text stays readable.
- Hide decorative photos on mobile (<900 px) to keep pages light.
- No stock-style handshakes, no cartoon illustrations. The UK flag appears only in the logo and icon, not as decoration elsewhere.

---

## 8. Voice and tone

**Like a friend who made the same move and checked the rules for you.** Plain, calm, specific, reassuring without promising outcomes.

| Do | Don't |
|---|---|
| "Find part-time jobs your Student visa allows." | "Unlock your dream career in the UK!" |
| "Rules checked against GOV.UK on 11 Nov 2026." | "100% guaranteed visa-safe." |
| "Can I take this job?" | "Job eligibility assessment tool" |
| "Free, no account needed." | "Sign up now to access premium features!" |
| "For your own case, speak to your university adviser or a registered immigration adviser." | "We'll handle your visa." |

Rules:
- **UK English**: programme, organisation, centre; £ before numbers (£766).
- Second person ("you"), active voice, short sentences.
- Name the real thing: Student visa, Graduate visa, Skilled Worker, Global Talent, eVisa, IHS.
- Numbers beat adjectives: "20 hours a week in term time", not "limited hours".
- Questions as entry points, written the way students ask them.
- Explain UK jargon in plain English (the site has a Jargon buster).

### Legal line (required wherever we give visa or work guidance)
> UniWorks gives general information, not immigration, tax or legal advice. Immigration advice in the UK is regulated by the Immigration Advice Authority: for your own case, speak to your university adviser or a registered immigration adviser.

Never call Global Talent Education services "immigration advice". Confirm the wording of any visa-document service under UK immigration advice rules before promoting it.

---

## 9. Contact details (current)

| | |
|---|---|
| Email | admin@globaltalent-education.com (temporary, until a UniWorks address exists) |
| Phone | Not published |
| Website | www.globaltalent-education.com |
| Operator | Global Talent Education |
| United Kingdom | St. Johns Close, Woodsley, Leeds, West Yorkshire |
| Indonesia | Taman Arcadia Mediterania, Tapos, Depok, West Java |

---

## 10. Known inconsistencies to fix

1. Fixed 14 Nov: favicon, duplicate fonts, second yellow, privacy policy and terms.
2. **Social accounts** aren't set up; when they are, add icons to the footer Contact column.
