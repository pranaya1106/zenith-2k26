# ZENITH ’26 — The AI Voyage

Official website for ZENITH ’26, the national-level hackathon organised by **SCOPE Club** at
**MLR Institute of Technology, Hyderabad**.

The information architecture follows the ZENITH ’25 site; the visual language is new — an
editorial "mission log": near-black grain, electric-purple structural blocks, mint / pink /
coral signals, oversized metallic wordmark, and monospaced telemetry labels.

---

## Run it

```bash
npm install
npm run dev      # http://127.0.0.1:5173
npm run build    # production bundle in dist/
npm run preview  # serve the production build
```

Stack: React 18 + Vite 5, plain CSS (no UI or animation library). Fonts are loaded from
Google Fonts: **Plus Jakarta Sans** (the typeface named in the brand guide) and **JetBrains
Mono** for technical labels. Font files were not supplied with the brand assets.

---

## Structure

```
src/
├── App.jsx                 # page composition + providers
├── index.css               # design tokens, type scale, tones, buttons, reveal primitives
├── data/site.js            # ALL event content — edit here first
├── hooks/useReveal.js      # IntersectionObserver reveals + countdown math
└── components/
    ├── Navbar.jsx          # header, scroll state, active section, mobile menu
    ├── Hero.jsx            # wordmark, brief card, countdown
    ├── Ticker.jsx          # mint event strip
    ├── Benefits.jsx        # 01 — Why join ZENITH?
    ├── About.jsx           # 02 — mission + objectives (purple)
    ├── Domains.jsx         # 03 — Healthcare / Education / AgriTech
    ├── Timeline.jsx        # 04 — run of show
    ├── Speakers.jsx        # 05 — previous-edition lineup
    ├── FAQ.jsx             # 06 — accessible accordion (paper)
    ├── Contact.jsx         # 07 — crew details + registration card
    ├── Footer.jsx          # org strip, links, closing wordmark
    ├── BackToTop.jsx
    ├── RegisterButton.jsx  # real URL, or an honest "opening shortly" dialog
    └── ui/                 # SectionHead, Dialog, Icons
```

Each component owns a sibling `.css` file. Shared tokens live in `src/index.css`; section
tones are applied with `tone-dark`, `tone-charcoal`, `tone-purple`, `tone-paper`.

---

## Content: what is confirmed and what is a placeholder

`src/data/site.js` is the single source of truth. Every block is commented as either
`official` (from the supplied ZENITH ’26 poster / brand assets) or `previous-edition`
(carried over from ZENITH ’25 as mock content).

**Official ’26 facts used on the site**

- Dates: 17—19 December 2026
- Venue: MLR Institute of Technology, Dundigal, Hyderabad
- Prize pool: ₹1.5 lakh
- Registration fee: ₹499
- Format: a two-day national hackathon plus an AWS Community Day
- Registration domain: ZENITH ’26, SCOPE Club, in collaboration with AWS

**Placeholders that must be updated before launch**

| Content | Where | Current state |
| --- | --- | --- |
| Registration link | `links.registration` in `data/site.js` | `null` → CTA opens a status dialog |
| Problem statements | `links.problemStatements` | `null` → CTA opens a status dialog; ’25 archive linked |
| Timeline | `timeline.items` | ZENITH ’25 run of show, labelled **Provisional** in the UI |
| Speakers | `speakers.people` | ZENITH ’25 profiles, labelled **’25 edition** in the UI |
| FAQ | `faqs` | ZENITH ’25 questions and answers |
| Mission text | `about.mission` | ZENITH ’25 mission statement, labelled as such |

Set `links.registration` to a URL and the hero, nav, contact card and mobile menu CTAs
become real links automatically. The same applies to `links.problemStatements`.
Replace the timeline/speaker labelled blocks and remove their `provisional` flags when the
’26 schedule and lineup are confirmed.

Do not invent dates, speakers, sponsors, prize amounts or contact details. All contact
data and social URLs are the real previous-edition details.

---

## Assets

The supplied brand pack at the repository root is the source of truth. Web-optimised copies
live in `public/assets/` (WebP, transparency preserved):

- `brand/` — official ZENITH ’26 wordmark + full lockup, SCOPE Club mark, AWS Student
  Builder Group, MLR Institute of Technology (white variants), AWS mark, favicon.
- `shapes/` — the brand's notched purple block, four-lobe star, mint clover, pink block.
- `ai/` — the 3D voyage forms (pink star, white knot, orange bloom), used as brand
  decoration only — never as sponsor claims.
- `texture/grain.webp` — tiled film grain.

To swap in new artwork, replace the file in `public/assets/...` and keep the same path.
Logos are never recreated in type; the nav uses the official SCOPE mark alongside the
event name, and the hero/footer use the official wordmark.

---

## Accessibility & motion

- Semantic landmarks, one `h1`, logical `h2`/`h3` hierarchy, visible focus rings.
- Accordion uses `aria-expanded` / `aria-controls` and hides collapsed answers from AT.
- Mobile menu: `aria-modal`, focus moves to Close, focus trap, Escape closes, focus returns
  to the toggle, background scroll locked.
- All CTAs are real links, real `tel:`/`mailto:` links, or buttons that explain their status.
- `prefers-reduced-motion` disables reveals, the marquee, the countdown pulse and smooth
  scrolling; content is visible without JavaScript.
- No horizontal overflow at 320 / 390 / 768 / 1024 / 1440 widths (audited).

---

© 2026 SCOPE Club, MLR Institute of Technology.
