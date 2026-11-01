---
name: "ZENITH '26 — The AI Voyage"
description: "A dark stage lit by light leaks, with glossy 3D props, bento tiles and one loud wordmark. Event identity for SCOPE Club's national AI hackathon."
colors:
  ink: "#08080a"
  charcoal: "#191c1d"
  surface: "#101013"
  surface-2: "#16161a"
  paper: "#ece9e2"
  white: "#ffffff"
  text: "#f4f2f6"
  muted: "#a29faf"
  violet: "#6b2dea"
  violet-glow: "#7c3ff7"
  violet-soft: "#8b6cff"
  periwinkle: "#6861cc"
  indigo-dark: "#34325e"
  indigo-deep: "#262746"
  mint: "#20e399"
  pink: "#fb57a6"
  pink-deep: "#e94477"
  coral: "#f86628"
  indigo-band: "#2d2b5f"
  bullet-violet: "#5b57e6"
  violet-tint: "#d9d4ff"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 1.5rem + 5.4vw, 5.6rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 1.4rem + 3.4vw, 4.1rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "clamp(1.35rem, 1.15rem + 0.9vw, 1.9rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
  lead:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "clamp(1.05rem, 0.98rem + 0.4vw, 1.3rem)"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "clamp(0.95rem, 0.92rem + 0.16vw, 1.0625rem)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "clamp(0.625rem, 0.58rem + 0.18vw, 0.72rem)"
    fontWeight: 600
    lineHeight: 1.6
    letterSpacing: "0.12em"
  button:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "clamp(0.75rem, 0.72rem + 0.14vw, 0.8125rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.11em"
rounded:
  xs: "2px"
  sm: "6px"
  md: "14px"
  lg: "18px"
  xl: "20px"
  pill: "999px"
  nav-tab: "0 0 40px 40px"
spacing:
  gutter: "clamp(1.25rem, 4vw, 4rem)"
  gap: "clamp(1rem, 1.6vw, 1.5rem)"
  section-y: "clamp(1.25rem, 2vw, 1.75rem)"
  container: "1360px"
  nav-height: "76px"
components:
  button-primary:
    backgroundColor: "{colors.text}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.xs}"
    padding: "0.85rem 1.6rem"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.ink}"
  button-purple:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.xs}"
    padding: "0.85rem 1.6rem"
    height: "52px"
  button-outline:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.text}"
    typography: "{typography.button}"
    rounded: "{rounded.xs}"
    padding: "0.85rem 1.6rem"
    height: "52px"
  chip:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: "0.42em 0.7em"
  nav-tab:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.nav-tab}"
    padding: "0.85rem 2.8rem 1rem"
  card-event:
    backgroundColor: "#16141f"
    textColor: "{colors.text}"
    rounded: "{rounded.xl}"
    padding: "clamp(1.5rem, 2.5vw, 2rem)"
  card-feature-violet:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
  panel-domain:
    backgroundColor: "#121214"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
  hang-sign:
    backgroundColor: "#f0ece1"
    textColor: "{colors.indigo-deep}"
    rounded: "{rounded.sm}"
---

# Design System: ZENITH '26 — The AI Voyage

> **Status: draft v1, written 2026-11-01.** Compiled from four sources: the Figma file `Zenith2k26` (`zIOSVfHT8m1SoBwou7G608`), the ZENITH '26 Brand Guide (PDFs and `ZENITH_26_BRAND_GUIDE_EXTRACTED.md`), the Drive asset pack (Effects, Elements, Fonts, Logos, Patterns, Shapes, Textures) and the current React site in `src/`. The Creative North Star and the voice in the Overview are **proposed, not owner-confirmed**: Impeccable's interview step was skipped on request. Values marked "measured" were read from Figma layers; values marked "code" come from `src/index.css` and the component CSS. Nothing here was checked in a rendered browser. See section 14 for what that limits.

## Overview

**Creative North Star: "The Lit Stage"**

ZENITH '26 is a dark room with the lights pointed at the props. The surface is charcoal-black with a faint film grain and a hairline grid. Light leaks spill in from the top corners. Glossy 3D forms (a red-pink ribbon from the top, a violet fold from the left, a mint clover from the right, an orange asterisk, a pink four-point star, a white knot) sit in front of that dark surface like objects on a stage. A single oversized metallic wordmark, "ZENITH", does the shouting. Everything else is quiet, flat and evenly spaced, so the 3D props and the wordmark carry all the personality.

Information lives in bento tiles. Violet, mint and pink blocks with notched, organic silhouettes hold the pitch ("AWS Workshops", "Turn your ideas into AI Powered solutions", "AWS Speaker Sessions"). Dates, venue, fee and contacts sit in a flat navy band at the bottom, separated into labelled columns by small violet square bullets. The tone is confident and youthful: bold uppercase headings, plain sentences, no jargon.

This is a Persuade surface in Impeccable's terms: a landing page whose job is to get a student to register. Ambition shows as one committed visual world, not as a stack of effects.

**Key Characteristics:**
- Dark first. Charcoal (`#191c1d`) or near-black ink (`#08080a`) is the default surface; light surfaces are rare accents.
- One typeface, Plus Jakarta Sans, in five weights from 400 to 800.
- Violet is structure (blocks, cards, buttons). Mint, pink and coral are signals (highlights, states, icons) and stay small.
- Depth comes from layers (grain, light leaks, 3D props, content), not from heavy shadows or glass.
- Real brand assets only. Logos, shapes and 3D forms are placed from the pack, never redrawn or approximated in CSS.
- Content is data-driven (`src/data/site.js`), and unconfirmed content is labelled instead of invented.

## Colors

A near-black stage, a violet structure, and three small signal colors. Hex values below are the **code** values and match the Brand Guide unless noted.

### Primary
- **Bright Violet** (`#6b2dea`): the main structural accent. Feature cards, primary-purple buttons, the active-link underline, selection background, the "em" word in section headings on dark sections. Brand Guide name: Bright Purple.
- **Violet Glow** (`#7c3ff7`): the top-left highlight of violet gradients only (`#7c3ff7 → #6b2dea → #591cce`). Never a flat fill.
- **Periwinkle** (`#6861cc`): the Brand Guide's "Medium Purple". Secondary accent, hover scrollbar thumb, secondary strokes.

### Secondary
- **Signal Mint** (`#20e399`): focus rings, hover fill on buttons, the ticker strip, timeline active dots, card hover borders, icons. The brightest thing on screen; use it where the eye should land.
- **Hot Pink** (`#fb57a6`, deep `#e94477`): the hanging sign's string and holes, final timeline dot, the third domain accent. Brand Guide: Bright Pink and Hot Pink.
- **Coral** (`#f86628`): reserved for the orange asterisk (Claude form) and rare warm accents.

### Tertiary
- **Soft Violet** (`#8b6cff`): a legible violet for small type on dark (domain index and code). Hard-coded in `Domains.css`; not a Brand Guide color.
- **Dark Indigo** (`#34325e`) and **Deep Indigo** (`#262746`): the navy family. Deep Indigo is the text color on the hanging sign and the base for the poster's info band. Dark Indigo is in the Brand Guide but unused in code.

### Neutral
- **Ink** (`#08080a`): page background and the default section surface in code. Darker than the Brand Guide's charcoal, see the divergence note below.
- **Charcoal** (`#191c1d`): the Brand Guide's primary dark background. In code it is defined (`tone-charcoal`) but no section uses it.
- **Surface** (`#101013`) and **Surface 2** (`#16161a`): raised dark surfaces.
- **Paper** (`#ece9e2`): a warm off-white for the rare light section (`tone-paper`, currently unused) and the hanging sign.
- **Text** (`#f4f2f6`): body text on dark. Brand Guide says pure white (`#ffffff`); code uses this slightly cooler white for body and `#fff` on violet.
- **Muted** (`#a29faf`): secondary text on dark.
- **Lines**: `rgba(244,242,246,0.14)` hairlines, `0.30` for strong lines.

### Source comparison

The three sources disagree in small ways. Code follows the Brand Guide, and the Figma poster is the art direction reference.

| Role | Brand Guide | Figma poster (measured) | Site code |
|---|---|---|---|
| Dark surface | `#191C1D` | `#181b1d` | `--ink #08080a` (page), `--charcoal #191c1d` (unused) |
| Violet | `#6B2DEA` | `#7d40ff`, `#534fda` | `#6b2dea` |
| Medium purple | `#6861CC` | `#6861cc` | `#6861cc` |
| Navy band | `#34325E`, `#262746` | `#2a2a4c`, `#2e306d`, `#323270` | `#262746` |
| Mint | `#20E399` | `#20e399` | `#20e399` |
| Pink | `#FB57A6`, `#E94477` | `#f95589` | `#fb57a6`, `#e94477` |
| Coral | `#F86628` | n/a (art asset) | `#f86628` |

### Contrast (approximate, from the hex values)
- Muted `#a29faf` on Ink: about 7.7:1. On Charcoal: about 6.6:1.
- White on Bright Violet: about 6.6:1. White on Periwinkle: about 5.0:1.
- Mint on Ink, and Ink on Mint: about 11.9:1.
- Pink `#fb57a6` on Ink: about 6.7:1. **White on Pink: about 3.0:1**, so use Ink text on pink fills, or only large bold white text.
- Footer legal text `#7f7c8c` on Ink: about 4.9:1, but it is set at roughly 9px, which is the problem (see section 14).

### Named Rules
**The Dark Stage Rule.** The default surface is dark. A light section needs a reason (a single paper moment for contrast), and it must keep the same type and shape system.

**The Signal Budget Rule.** Mint, pink and coral together should cover well under a tenth of any screen. One signal color per component. Violet carries the weight; signals only point.

**The Ink-On-Bright Rule.** Text on mint and pink fills is Ink (`#08080a` or `#07120c`). White text is for violet and dark surfaces only.

## Typography

**Display, Headline, Body and Label font:** Plus Jakarta Sans (fallbacks: `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `system-ui`, `sans-serif`), weights 400, 500, 600, 700, 800, loaded from Google Fonts.

**Wordmark:** "ZENITH", "2K26" and "SCOPE Club Presents" in the poster are custom lettering supplied as image assets (`zenith-wordmark.webp`, `zenith2k26-logo-full`). Never retype them in a font.

**Character:** A geometric, slightly wide sans with real weight contrast. Bold uppercase headings with tight tracking against calm regular body copy.

### Brand Guide scale (print, social, poster)

| Weight | Size | Use |
|---|---|---|
| Normal 400 | 12–14px | Captions |
| Medium 500 | 14–18px | Body |
| Semi Bold 600 | 18–24px | H3 subheaders |
| Bold 700 | 24–32px | H2 headings |
| Extra Bold 800 | 32–48px | H1 titles |

### Hierarchy (web, code)
- **Display** (800, `clamp(2.6rem, 1.5rem + 5.4vw, 5.6rem)` which is about 42–90px, line-height 0.9, tracking -0.045em, uppercase): section titles. Max 15 characters wide (`15ch`), balanced wrapping.
- **Headline** (800, `clamp(2.1rem, 1.4rem + 3.4vw, 4.1rem)`, line-height 1, tracking -0.03em): secondary large headings.
- **Title** (800, `clamp(1.35rem, 1.15rem + 0.9vw, 1.9rem)`, line-height 1): card and panel titles.
- **Lead** (400, `clamp(1.05rem, 0.98rem + 0.4vw, 1.3rem)`): intro paragraphs.
- **Body** (400, `clamp(0.95rem, 0.92rem + 0.16vw, 1.0625rem)`, line-height 1.6): running text, aim for 65–75 characters per line.
- **Label** (600, `clamp(0.625rem, 0.58rem + 0.18vw, 0.72rem)`, tracking 0.12em, uppercase): metadata, chips, event-card labels.
- **Button** (700, `clamp(0.75rem, 0.72rem + 0.14vw, 0.8125rem)`, tracking 0.11em, uppercase).

### Poster type (Figma final poster `7:5705`, measured, 1122×1402)
Plus Jakarta Sans throughout: date 32 ExtraBold, fee 40 ExtraBold, prize amount 61 ExtraBold, "The AI Voyage" 39 ExtraBold, subline 28 Regular, "The Year of" 26 SemiBold, "Prize Pool worth" 25 Medium, venue 22 Bold, bento tile labels 18 Bold or SemiBold, field labels 19 Regular, contacts 20 SemiBold, social handles 21 Medium.

### Named Rules
**The One Family Rule.** All text is Plus Jakarta Sans. The site currently also loads **JetBrains Mono** (many small labels) and **Permanent Marker** (the four "perk" card titles). Neither is in the Brand Guide. Either retire them or have the owner approve them in writing; until then, new work uses Plus Jakarta Sans only.

**The Weight Ladder Rule.** Hierarchy comes from weight steps (400, 500, 600, 700, 800) and size, never from color alone and never from a second typeface.

**The Web Scales Up Rule.** The Brand Guide's 48px H1 cap is a poster rule. On the web, display type may scale above it (the site goes to about 90px), but the ratio between steps must stay obvious, display stays at or under 6rem, and tracking stays at or above -0.04em (the current -0.045em on section titles is slightly past this).

## Layout

**Model:** a single centered column. Container `max-width: 1360px` plus a fluid gutter of `clamp(1.25rem, 4vw, 4rem)`. Inside it, sections use grids that collapse to one column on small screens.

**Rhythm:** sections are close together (`--section-y: clamp(1.25rem, 2vw, 1.75rem)`) and separated by a soft gradient fade at the top of each section (`main > section + section::before`, 80–160px, Ink to transparent) instead of hard edges. Section headings add their own top hairline and a large gap below (`clamp(2.5rem, 5vw, 5rem)`).

**Navigation:** fixed header, 76px tall (64px under 720px). Official logos left and right with a white floating tab of links hanging from the top edge. Hides on scroll down. Under 960px it becomes a menu button and a full-screen menu.

**Page order (code):** Hero, Benefits ("Why join"), About, Domains, Timeline, Speakers, Sponsors, FAQ, Contact, Footer. A mint Ticker strip exists as a component but is not mounted in `App.jsx`. Every section currently uses `tone-dark`; the purple, charcoal and paper tones exist in CSS but are unused.

**Hero layout:** two columns on desktop (wordmark with hanging sign, and the event card at 288–356px), stacked under 1024px. Vertical hairlines at 25%, 50% and 75% frame the stage. CTAs are centered below.

**Breakpoints in use (code):** 520, 560, 720, 760, 768 (timeline), 860, 900, 959/960 (nav), 980, 1023. These are too many; new work should use **560 / 760 / 960** and leave the rest alone until a consolidation pass.

**Poster grid (Figma, the art-direction reference):** 1122×1402 (4:5), side margins about 41–45px (about 4%). From the top: logos row (y≈42), "SCOPE Club Presents" and title block (y≈177–578), bento grid of about 731×301 (y≈604–905), prize pool (y≈990–1096) with "In Collaboration with AWS" on the right, three-column info band 965×230 at x=78 (y≈1102–1332; column widths 410, 243, 312), social handles (y≈1349). The same order carries to the web: identity, title, pitch tiles, money, logistics, links.

**Social formats:** Instagram story 1080×1920 (three versions in Figma), slide 16:9 (1402×788), video frame 1411×960. They reuse the poster's blocks in a single column.

### Named Rules
**The Poster Order Rule.** When adding a section or a format, keep the poster's reading order: who, what, pitch, prize, logistics, links.

**The Soft Hand-off Rule.** Sections blend by gradient fade and tone, not by borders or divider lines (other than the section-head hairline).

## Elevation & Depth

Depth is built from layers, not from big shadows. From back to front:

1. **Surface**: Ink or Charcoal, with a fixed film-grain overlay (`/assets/texture/grain.webp`, 300px tile, 5% opacity, soft-light blend, on `body::after` above everything).
2. **Atmosphere**: left and right light leaks (`left-lighting-effect.png`, `right-lighting-effect.png`) at about 35% opacity, radial-masked so only a soft glow enters from the top corners; the bg grid pattern at low opacity; faint vertical rules.
3. **Props**: large 3D forms (purple star, pink star, orange bloom, violet fold, green clover, red ribbon) at the edges, partly off-canvas, with scroll parallax, slow spin and mouse-drift. They sit behind text and are decorative (`aria-hidden`).
4. **Content**: tiles, cards and type.
5. **Overlays**: the nav, dialogs.

### Shadow vocabulary (code)
- **Ambient card** (`0 2px 8px rgba(0,0,0,0.2), 0 8px 32px rgba(0,0,0,0.25)`): the tilt/event card at rest.
- **Lift on hover** (`0 18px 36px rgba(0,0,0,0.45)` with a 4px upward move): About tiles, sponsor cards.
- **Feature block** (`0 24px 50px rgba(0,0,0,0.4)`; `0 32px 80px rgba(0,0,0,0.38)`): large violet cards.
- **Dialog** (`0 40px 120px rgba(0,0,0,0.6)`).
- **Nav tab** (`0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)`).
- **Signal glow** (`0 0 0 5px rgba(32,227,153,0.14), 0 0 14px rgba(32,227,153,0.6)`): only on the tiny timeline dots. Pink variant for the final dot.
- **Prop drop shadow** (`filter: drop-shadow(0 22px 34px rgba(0,0,0,0.45))`): under the 3D forms.

### Named Rules
**The Layers-Not-Shadows Rule.** Depth comes from the layer stack above. A shadow always has an offset and a blur; a zero-offset colored halo is allowed only on small signal dots.

**The Props-Behind-Text Rule.** A 3D prop never covers text or a control. If a prop collides with content at some width, move or shrink the prop. (On the Figma landing frame I built earlier, the orange asterisk and pink star overlapped text; that frame no longer exists, but the lesson stands.)

## Shapes

**Form language:** soft, rounded rectangles with a few deliberate organic notches. Sharp 2px corners on controls give a crisp contrast to the soft cards.

- **Controls** (buttons, chips, dialog): `2px`.
- **Sign and small plates:** `6px`.
- **Cards and tiles:** `14px` (About tiles, sponsor and problem-statement cards), `16px` (timeline card), `18px` (domain panels, perk cards), `20px` (event/tilt card). Five near-identical values; consolidate to `14 / 18 / 20` over time.
- **Pills:** `999px` (domain chips).
- **Nav tab:** square top, `40px` radius on the bottom two corners, so it reads as a tab hanging from the page edge.
- **Notch:** the unused `.brief` card cuts a 30px diagonal off its top-right corner with `clip-path`. Keep the notch idea for hero cards if it returns.
- **Brand silhouettes** (from the Shapes pack): `shapes-v1` violet block with a curved indent, `shapes-v2` violet panel with a white curved accent, `shapes-v3` mint four-lobe clover, `shapes-v4` pink block with a curved top notch, `bg-bottom` large wave. Use these as image assets for tiles and backgrounds; do not approximate them with `border-radius` or polygons.
- **Bullets:** small violet squares mark field labels in the info band.
- **Hanging sign:** the one skeuomorphic object: a paper plate with two pink holes, hung by a pink string from the "H" of ZENITH, carrying the theme text "The AI Voyage".

## Components

### Buttons
Crisp, uppercase, wide-tracked. `min-height: 52px`, padding `0.85rem 1.6rem`, `2px` radius, 1px border.
- **Primary:** fill `#f4f2f6`, Ink text. Hover: fill and border go Mint, text stays Ink, the arrow icon moves 2px up-right.
- **Purple:** fill Bright Violet, white text. Hover: Mint with Ink text.
- **Outline (default `.btn`):** transparent, text color, 1px strong line. Hover: Mint.
- **Small:** `44px` tall, `0.66rem` text. Block variant is full width. On phones, hero CTAs go full width.
- Registration CTAs are `RegisterButton`: a real link when `links.registration` is set, otherwise a button that opens an honest "opening shortly" dialog.

### Labels and chips
Uppercase, tracked (0.12em), muted. Chips have a 1px line and `2px` radius; domain chips are pills.

### Navigation
White hanging tab (`#fff`, Ink-ish `#333` links at 0.84rem/500, active link 600 with a 2px violet underline that scales in). Official MLRIT/SCOPE logos left and AWS Student Builder Group right, at 90% opacity. Mobile: toggle button, focus-trapped dialog-style menu, Escape closes.

### Hero
Official wordmark image with a swinging sign (settles with a decaying swing, then idles at ±4°). Parallax props. Event card (tilt with mouse, inner layers at different depths) showing Date, Venue, Format. Two CTAs.

### Event card (TiltCard)
`20px` radius, 1px white-12% border, dark violet-black gradient (`#1e1b2e → #0f0e17`). Mint uppercase title; rows of label (5.2rem column) and value, separated by 10%-white hairlines.

### Perk cards ("Why join")
Four dark "smoked glass" cards, fanned and slightly rotated, with a hand-lettered mint title, a duotone mint icon in a dark tile, and short copy. Hover straightens and lifts the card with a mint border. Mobile: single column with a scroll-drawn connector line. *Departs from the Brand Guide: marker font and decorative blur.*

### Domain panels
Three side-by-side panels that expand on click or focus (flex-grow animation, 0.75s, `cubic-bezier(0.65, 0, 0.2, 1)`), each on a shared dark texture with a brand shape drifting against the pointer. Collapsed state shows a vertical title; mobile becomes a vertical accordion. One accent color per panel (pink, mint, soft violet), used only on small type.

### Timeline
Sticky, scroll-driven run of show (`240vh` on desktop from 768px) with a violet card and mint progress line and dots; the last dot is pink. Static list under reduced motion.

### Section head
Top hairline, small uppercase label, optional note, then a Display-size uppercase title with one emphasized word in violet (mint on violet sections). *Currently renders a numbered label (`01 — Why join`) above every title; see section 14.*

### Info band (Figma poster, not yet on the site)
A flat navy band, three columns (Date and Location, QR code, Registration fee and Queries) with violet square bullets and ExtraBold values. Reuse this pattern for the Contact section.

### Dialog
Native-style modal, `2px` radius, `#111114` fill, 18%-white border, large soft shadow. Used for "registration opening shortly".

### FAQ
Accessible accordion (`aria-expanded`, `aria-controls`, hidden answers removed from the accessibility tree).

### Footer
Official logos, link list, and a giant "ZENITH '26" wordmark painted in a barely-visible tone (`#1b1a20`, hover `#24232b`) via a mask of `footer-zenith.webp`.

### Ticker
Mint strip with Ink text, marquee that pauses on hover. Exists but is not mounted.

## Do's and Don'ts

### Do:
- **Do** use only official assets for logos and 3D forms, in the correct variant for the background (for example `scope-club-white` on dark). Check `Logos/` for the black, white and color versions.
- **Do** keep logos at least **120px wide** on screen (Brand Guide minimum).
- **Do** keep body text at **14px or larger** and captions at **12px or larger** (Brand Guide minimums).
- **Do** keep text contrast at **4.5:1** for body and **3:1** for large text. Use Ink on mint and pink fills.
- **Do** use one accent color per component and let violet carry the structure.
- **Do** make every interactive element reachable by keyboard with the mint `:focus-visible` ring (2px, 3px offset), and keep the skip link.
- **Do** respect `prefers-reduced-motion`: reveals, marquee, parallax, the swinging sign and the timeline pin all need a static fallback.
- **Do** put all event facts in `src/data/site.js` and keep the `official` and `previous-edition` provenance comments.
- **Do** keep one authored motion moment per screen: the swinging sign in the hero, the pinned timeline further down. Everything else is a single quiet reveal.
- **Do** theme browser surfaces from the palette (selection is violet today; keep scrollbar and caret on-brand too).
- **Do** use the supplied `Patterns/bg-grid-pattern.png` for grid backgrounds instead of a CSS hairline grid.

### Don't:
- **Don't** introduce a second typeface or fall back to a system display font for headings.
- **Don't** redraw logos, retype the wordmark, or recreate the 3D forms in CSS or SVG.
- **Don't** use the AI forms (Gemini-style pink star, OpenAI-style knot, Claude-style bloom) as sponsor logos or imply endorsement. They are decoration only.
- **Don't** put white text on pink fills for body copy (about 3.0:1).
- **Don't** let a 3D prop overlap text, a form field or a button.
- **Don't** add gradient text, hard offset "neobrutalist" shadows, or zero-offset glow halos on cards.
- **Don't** add nested cards or rows of identical icon-heading-text cards as a page structure. The bento grid works because its tiles differ in size, color and content.
- **Don't** invent dates, speakers, sponsors, amounts or phone numbers. Mark unconfirmed content as provisional.
- **Don't** ship raw PNGs from the asset pack. Convert to WebP (the repo root PNGs are 100 KB to 3.7 MB each).
- **Don't** use a colored side border over 1px on cards or callouts.
- **Don't** hard-code a hex value in a component when a token exists; add a token first.

## 9. Project context and content truth

**What it is.** ZENITH '26, "The Year of 2K26 — The AI Voyage". A national hackathon and AWS Community Day. Organiser: SCOPE Club (School of Programming Excellence) at MLR Institute of Technology, Hyderabad, in collaboration with AWS Student Builder Group at MLRIT. Audience: engineering students (and some professionals) across India who might travel or register for a three-day event. Primary action: register (₹499).

**Confirmed from the final poster** (Figma `7:5705`, `final_zenith_poster_dont_delete`):
- Dates: Dec 17th, 18th & 19th, '26. Venue: MLR Institute of Technology, Hyderabad.
- Prize pool: ₹1.5 Lac/-. Registration fee: ₹499/-.
- Pitch line: "Turn your ideas into AI Powered solutions". Registration site: `www.zenith.2k26.app` (plus a QR code).
- Tiles: AWS Workshops, AWS Speaker Sessions. Socials: Instagram `mlrit_scope`, LinkedIn `scope-club-mlrit`.
- Contacts: Vignesh 89783 71629 and Pranadeep 79812 13067.
- Sub-headline: "Join us for a 2 Day National Hackathon and AWS Community Day".

**Conflicts that need an owner decision** (do not silently resolve):

| Topic | Source A | Source B | Suggested default |
|---|---|---|---|
| Prize pool | Final poster: ₹1.5 Lac | Earlier Figma poster and Instagram story: ₹1,00,000 | ₹1.5 Lakh (final poster, matches site) |
| Contacts | Final poster: Vignesh, Pranadeep | Site `contact.people`: Ravindher, Triveni (previous edition) | Use the poster's '26 contacts |
| Format | Poster: "2 Day" hackathon and Community Day, but three dates | Site: "3-day event", Dec 17 Community Day, Dec 18–19 24-hour hackathon | Needs owner confirmation |
| Registration | Poster: `www.zenith.2k26.app` and QR | Site: `links.registration = null`, CTA opens a dialog | Set the link once live |
| Domains | Site only: AI for Healthcare, Education, Security | Not on any poster | Keep, flag as unconfirmed for '26 |
| Timeline, speakers, FAQ, sponsors | Site: '25 content, labelled provisional or empty | Nothing in Figma | Replace when confirmed |

## 10. Design methods

### 10.1 How design decisions are made here
1. **The brief wins.** The Brand Guide, the final poster and the owner's word outrank taste. Where the site departs from them (mono labels, marker font), the departure is listed as a gap, not defended.
2. **Poster first, web second.** The Figma poster is the art direction reference; the site is a translation of it into a scrolling page, not a separate design.
3. **Refine, don't replace.** The site's identity (dark stage, violet blocks, 3D props, metallic wordmark) is the incumbent. Changes preserve it unless the owner asks for a rebrand.
4. **One world, many formats.** The same blocks, colors, type and assets serve the poster, stories, slide, video and web. Don't invent a format-specific look.

### 10.2 Poster-to-web translation method
1. Identify layers (the poster's Figma groups: `bg`, `grid-pattern`, `bottom-vector-shape`, `footer-gradient`, `bottom-section`, `left-violet-shape`, `right-green-shape`, `top-red-shape`, `top-logos`, `price-pool`, `studio-lights`, `socials`, `collaboration-with`, `top-section`, `middle-section`, `3D-AI-logos`).
2. Map each to a web layer: surface and grain, atmosphere, props, content (see Elevation & Depth).
3. Convert fixed positions to a flow layout. Keep reading order; drop absolute coordinates.
4. Convert poster type sizes to the fluid scale above; keep weights.
5. Reuse assets from `public/assets/`; never rebuild.
6. Check at 320, 390, 768, 1024 and 1440 widths, with real copy.

### 10.3 Figma-to-code method (with the Figma power)
1. Take the file key and node id from the URL (`https://figma.com/design/<fileKey>/<name>?node-id=1-2` gives node `1:2`).
2. Fetch `get_design_context` for the node, and `get_metadata` first if the node is large (the Zenith page is about 640 KB of metadata, so always query frames, not the page).
3. Fetch `get_screenshot` as the visual truth. Screenshot URLs are short-lived and should be treated as secrets.
4. Download assets from the returned `localhost` URLs. Don't import icon packages.
5. Translate to the project's tokens in `src/index.css`. This project uses plain CSS, not Tailwind; convert any Tailwind output.
6. Match visually, preferring project tokens when they differ slightly from Figma values.
7. Validate against the screenshot: layout, type, color, states, responsive behavior, assets, accessibility.
8. The Figma free/starter tier has a tool-call limit; batch calls and avoid re-rendering needlessly.

### 10.4 Asset pipeline
- **Source of truth:** the Drive pack (`Effects`, `Elements/Bakcground`, `Elements/Foreground`, `Fonts`, `Logos/{AWS, AWS SBG, MLRIT, SCOPE, ZENITH}`, `Patterns`, `Shapes`, `Textures`). Note that the folder is spelled `Bakcground` in the pack.
- **Web copies:** `public/assets/{brand, shapes, ai, speakers, texture}` as WebP with transparency kept. Replace the file in place and keep the path.
- **Naming (Brand Guide):** logos `[brand]-[color]-[background]`, foreground `fg-[name]`, shapes `shapes-v[n]`, backgrounds `bg-[name]`, effects `[position]-lighting-effect`, patterns `bg-[type]-pattern`, texture `bg-texture`.
- **Formats:** SVG for logos and shapes where available; PNG or WebP for raster. Large raw PNGs (`fg-*.png` 2–3.7 MB, `bg-texture.png` 6 MB) must not ship.

### 10.5 Content method
Event facts live in `src/data/site.js`. Each block is labelled `official` or `previous-edition`. Unconfirmed blocks carry a `provisional` flag and the UI says so. A link set to `null` opens a status dialog instead of a dead link.

### 10.6 Motion method
- Stack: Lenis (smooth scroll), GSAP ScrollTrigger and SplitText (parallax, section hand-off, timeline), Framer Motion (tilt card, timeline), CSS keyframes (sign, marquee).
- Easing: `cubic-bezier(0.22, 0.61, 0.36, 1)` (`--ease`) for UI, `cubic-bezier(0.22, 1, 0.36, 1)` for props, `cubic-bezier(0.65, 0, 0.2, 1)` for panel expansion. Durations 0.3–0.9s.
- Reveals use `data-reveal`: fade and 22px rise, staggered by `--reveal-delay`. Content is visible without JavaScript.
- Every motion has a `prefers-reduced-motion` fallback.

### 10.7 Review checklist (definition of done)
- Layout and spacing hold at 320, 390, 768, 1024 and 1440 widths, no horizontal scroll.
- Contrast: body 4.5:1, large 3:1.
- Text sizes: body at least 14px, captions at least 12px.
- Keyboard: tab order, visible focus, Escape closes overlays, skip link works.
- States: hover, focus, active, disabled, empty, loading, error.
- Reduced motion tested.
- Assets are WebP, sized and lazy where below the fold.
- Content matches section 9; nothing invented.
- Run the detector (section 12) and clear or justify findings.

## 11. Design knowledge

**Why dark.** The poster's identity is a stage: glossy 3D objects look best with light from the sides on a near-black ground. Dark also makes the violet, mint and pink read as light sources. It suits a night, tech-forward audience and keeps white logo variants usable everywhere.

**Why violet is structure and mint is signal.** Violet is calm and large; it can fill a tile without tiring the eye. Mint is the brightest, so it works for "look here" (focus, hover, active). Pink and coral add warmth in tiny doses.

**Why 3D props.** They give the page a memorable silhouette that flat UI can't, and they echo the AI-themed content. They stay at the edges and behind text so they never fight for the reading path. The pink star, white knot and orange bloom resemble well-known AI marks; they are decoration only.

**Why bento tiles.** Different sizes and colors give the pitch a visual rhythm and let one grid hold four messages. They map directly from the poster, so the web page and the poster look like siblings.

**Why a hanging sign.** One physical, playful object adds personality to an otherwise flat, geometric system. It is the single "delight" moment, so nothing else needs to compete.

**Typography knowledge.** Plus Jakarta Sans at ExtraBold with tight tracking and uppercase makes display text feel like a poster headline. Regular weight body at 15–17px with 1.6 line-height keeps long copy readable on dark. Letter-spaced uppercase labels need a size floor, because tracking helps legibility only above about 12px.

**Dark-theme accessibility.** Pure white on pure black glares; the site uses `#f4f2f6` on `#08080a`. Muted text should be tinted from the surface, not gray, and stay above 4.5:1. Colored fills need ink text if their luminance is high (mint, pink).

**Responsive knowledge.** The poster is portrait (4:5), so on phones the page is close to the poster itself: one column, props partly off-screen, full-width CTAs. On desktop the poster's horizontal bands become two-column grids and the bento grid widens.

**Performance knowledge.** The 3D forms, textures and speaker photos dominate weight. Use WebP, set `width` and `height`, load below-fold images lazily, and keep parallax on `transform` only. Parallax and smooth-scroll libraries add main-thread cost; they should degrade on low-power and reduced-motion settings.

**Provenance and trust knowledge.** A student deciding to pay ₹499 needs exact dates, venue, contacts and a working registration path. Wrong or stale facts cost more than plain design. Treat content accuracy as part of design quality.

## 12. Impeccable (installed)

- **Installed:** skill `impeccable` v4.8.0 in `.kiro/skills/impeccable/` (project scope), engine v0.1.18 for Windows. Installed with `npx impeccable install --providers=kiro --scope=project --yes`. Reload Kiro if the skill doesn't appear.
- **Not yet done:** `/impeccable init` (writes `PRODUCT.md`, product truth: audience, purpose, constraints). Run it in Kiro chat. This `DESIGN.md` is the visual half; `PRODUCT.md` is the missing half.
- **Hooks:** Kiro has no automatic design hook, so run the detector manually after UI edits.
- **Detector (works from a terminal):**
  - `npx impeccable detect src/ index.html` scans source files with pattern rules only.
  - `npx impeccable detect http://localhost:5173` scans the rendered page (needs `npm run dev` running and Chrome or Edge) and adds contrast and tiny-text rules. Run this for a real result.
  - `npx impeccable ignores add-value overused-font "Plus Jakarta Sans" --reason "Brand font"` if the font rule flags the brand typeface.
- **Which command to use for what:**

| Need | Command |
|---|---|
| Capture product context | `/impeccable init` |
| Re-sync this file with code | `/impeccable document` |
| Score the UX | `/impeccable critique the hero` |
| Technical review (a11y, performance, responsive) | `/impeccable audit` |
| Fix fonts and hierarchy (retire mono and marker) | `/impeccable typeset` |
| Fix spacing and rhythm | `/impeccable layout` |
| Pull repeated values into tokens | `/impeccable extract` |
| Screen sizes | `/impeccable adapt` |
| Edge cases, long text, errors | `/impeccable harden` |
| Rewrite unclear copy | `/impeccable clarify` |
| Final pass before launch | `/impeccable polish` |
| Calm a loud page / strengthen a flat one | `/impeccable quieter` / `/impeccable bolder` |

## 13. Source map

**Figma file** `Zenith2k26`, key `zIOSVfHT8m1SoBwou7G608`.
- *Page 1* (`0:1`): about 70 top-level items. About 25 poster frames (1122×1402), including the final poster `7:5705`. Instagram stories `6:5201`, `7:6106`, `38:2066` (1080×1920). Slide `17:6` (16:9). Video frames `38:2319`, `42:4051` (1411×960). Logos: `17:7` top-logos, MLRIT `19:88`, AWS SBG `23:203` and `23:224`, AWS `26:4`, `26:11`, `26:17`, `26:23`, ZENITH `26:29`, `26:41`, `26:58`, `26:69`, full lockup `27:95`. Shapes `32:122`, `32:128`, `32:138`, `32:158`. Lighting `33:175`, `33:179`. Grid `34:185`. Bottom wave `33:183`. Details example `34:325`. Middle section `34:355`. A reference section named `Inspiration_dont_delete_or_modify` (`7:6103`).
- *Landing Page* (`49:2`): holds two copies of the final poster (`240:2`, `240:363`). **It contains no web landing design.** A desktop frame built earlier in this session is gone, so there is no landing page design in Figma.
- *Variables and styles:* none. `get_variable_defs` returned empty for the final poster, so colors and type are hard-coded in Figma. This file is the only token record.

**Brand Guide.** `ZENITH ‘26 Brand Guide - Google Slides.pdf` (plus `odd` and `even` variants) and `ZENITH_26_BRAND_GUIDE_EXTRACTED.md`, both in the repo root.

**Fonts.** `Fonts/fonts_guide.png` (specimen and size ladder). No font files were supplied. Source: Google Fonts, Plus Jakarta Sans. Consider self-hosting.

**Code.** `src/index.css` (tokens, resets, buttons, tones), `src/App.css`, `src/components/*` (each with a sibling `.css`), `src/components/ui/*`, `src/data/site.js` (all content), `src/hooks/*`, `src/lib/smoothScroll.js`, `src/pages/ProblemStatements.*`, `index.html` (fonts and meta), `public/assets/*`.

**Stack.** React 18, Vite 5, plain CSS, GSAP 3.15, Lenis, Framer Motion.

## 14. Current-state audit and known gaps

**Method and limits.** Static reading of the source, the Brand Guide and the Figma file, plus `npx impeccable detect src/ index.html`, which scanned 48 files with pattern rules only and reported **0 anti-patterns and 2 advisories**. The rendered-page rules (contrast, tiny text) did not run, and no rendered screenshot of the site was reviewed. Treat the list as a hypothesis set to confirm with `npx impeccable detect http://localhost:5173` and `/impeccable audit`. Severity follows Impeccable's scale: P0 blocking, P1 important, P2 should fix, P3 polish.

### P1: content trust
1. **Contacts differ** between the final poster (Vignesh, Pranadeep) and the site (Ravindher, Triveni, previous edition).
2. **Registration CTA has no destination** while the poster publishes `www.zenith.2k26.app` and a QR code.
3. **Event format is inconsistent** ("2 Day" vs "3-day event / 24-hour hackathon").
4. **Prize pool differs** across Figma variants (₹1.5 Lac vs ₹1,00,000). Retire the outdated frames or mark them.

### P1: brand fidelity
5. **Fonts outside the Brand Guide.** JetBrains Mono is used for many labels (hero, domains, contact, footer, FAQ, timeline) and Permanent Marker for the perk titles, while the Brand Guide specifies Plus Jakarta Sans for all text. Both are also loaded from Google Fonts in `index.html`.
6. **Text below the Brand Guide's minimums.** Many labels are 9–10px (`0.56rem` to `0.62rem`, and the `--fs-mono` floor of `0.625rem`) against a 12px caption minimum and 14px body minimum. Footer legal text (`#7f7c8c`) is about 9px. Confirm with a rendered scan.

### P2: system hygiene
7. **Tokens bypassed.** Hard-coded colors include `#8b6cff`, `#7c3ff7` / `#591cce` / `#4f1cb8` (repeated in three gradients), `#1a1a1f`, `#121215`, `#121214`, `#111114`, `#0a0a0d`, `#050507`, `#1e1b2e`, `#d9d6e2`, `#a8a5b4`, `#7d7a8a`, `#7f7c8c`. Add tokens for the dark surfaces, the violet gradient and the muted-text steps.
8. **Radius scale is crowded.** Values 2, 5, 6, 13, 14, 16, 18, 20, 40 and 999px; five of them sit within 6px of each other.
9. **Too many breakpoints.** About ten distinct `max-width` values (520 to 1023).
10. **Display tracking.** Section titles use `-0.045em`, slightly below the `-0.04em` floor Impeccable recommends.
11. **Grid-line backgrounds flagged.** The detector's `codex-grid-background` advisory fires on `Benefits.css` (line 6) and `Sponsors.css` (line 2), which draw a CSS hairline grid. The grid itself is brand-approved (`Patterns/bg-grid-pattern.png`), so either switch these to the supplied asset or suppress the rule with a recorded reason.
12. **Section head pattern.** `SectionHead` shows a numbered label (`01 — Why join`) above every title. Impeccable treats an eyebrow above a heading as a ban and numbered sections as unwarranted unless the order matters. The site README presents the numbering as a signature, so this is a decision for the owner: keep it (and record the exception) or drop the label.
13. **Decorative glass.** The perk cards use `backdrop-filter: blur(12px)` as decoration; the poster has no glass.

### P3: polish and housekeeping
14. **README drift.** It says About is purple and FAQ is paper. In code, every section is `tone-dark`; the other tones are unused. The Ticker component is also unmounted.
15. **Dead CSS** in `Hero.css`: `.brief*`, `.hero__foot`, `.count*`, `.hero__eyebrow`, `.hero__facts`, `.hero__lede`, `.hero__tagline*` have no matching markup in `Hero.jsx`.
16. **Repo root clutter.** About 35 PNGs, three PDFs and `index-standalone.html` sit next to source files. Move raw assets to an `assets-source/` folder (outside the build) or out of the repo.
17. **No Figma landing design** and no Figma variables. Decide whether Figma or code is the source of truth for the web layout, and capture the site into Figma (`generate_figma_design`) if design needs to be reviewed there.
18. **Missing context file.** No `PRODUCT.md` yet (section 12).

### Strengths to preserve
- Semantic landmarks, skip link, one `h1`, visible mint focus ring, accessible accordion and menu behavior (focus trap, Escape, focus return).
- `prefers-reduced-motion` handling in `index.css` and most components; content visible without JavaScript.
- A single content file with provenance flags, and honest handling of unconfirmed content.
- Real brand assets throughout, no recreated logos.
- A coherent token base in `:root` (surfaces, accents, fluid type scale, motion easing).
- Scroll motion limited to `transform` and `opacity`, wrapped in `matchMedia`.

## 15. Maintenance

- **Update this file** when tokens, fonts, components or content truth change. Re-run `/impeccable document` after a large change; it will ask before overwriting.
- **Frontmatter is normative.** Don't restate a different hex in the prose.
- **Pending decisions** (the owner should answer, then update sections 9 and 14): final prize amount, contacts, event format, registration URL, whether mono and marker fonts are approved, whether numbered section labels stay.
- **Not generated:** the `.impeccable/design.json` sidecar (tonal ramps, component HTML/CSS). Run `/impeccable document` to produce it when the Impeccable live panel is needed.
