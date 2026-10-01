# Handoff: Permanence IA — Brand identity & logo system

## Overview
Visual identity for **Permanence IA** (permanenceia.com), a French company providing 24/7 AI voice agents that answer business phones (reception, appointment booking, lead qualification, urgent escalation, transfer to a human). Targets: SMBs, medical practices, lawyers, liberal professions, craftsmen, real-estate agencies, garages, clinics, salons.
Brand attributes: serious, reliable, human, modern, reassuring. No purple/pink/neon, no flashy gradients, no robot/brain/circuit imagery.

The package contains one brand board (single long scrolling page, 1440 px wide) covering: symbol concept, logo variants, legibility, palette, typography, applications (business card, email signature, invoice, mobile app, app icons, website hero, ads) and misuse rules.

## About the Design Files
The HTML file in this bundle is a **design reference created in HTML** — a prototype showing intended look, not production code to ship. The task is to **recreate these designs in the target codebase's environment** (e.g. a React/Next.js marketing site + app, email templates, print PDFs) using its established patterns, or choose an appropriate framework if none exists. The logo SVG geometry, however, IS final and can be used directly (see Assets).

## Fidelity
**High-fidelity.** Colors, typography, logo geometry and spacing are final. Application mockups (website hero, app screen, invoice) are representative layouts: match their styling exactly; content/copy can evolve.

## Logo specification

### Symbol ("la bulle en veille") — 48×48 unit grid
Three elements:
1. **Speech bubble** (petrol): rounded square 36×32 u, corner radius 10 u, tail bottom-left.
   Path: `M14 6H30A10 10 0 0 1 40 16V28A10 10 0 0 1 30 38H17L8 44.5V36.3A10 10 0 0 1 4 28V16A10 10 0 0 1 14 6Z`
2. **Voice wave** (white, or background color): 3 pill bars, width 4.5 u, rx 2.25, centered at x = 14 / 22 / 30, heights 10 / 18 / 10 u, vertically centered on y = 22.
3. **Availability dot** (turquoise): circle cx 39, cy 9, r 5.5. The bubble is knocked out by a concentric circle r 9 (3.5 u gap) — implemented with an SVG mask.
Canonical SVG: `assets/symbol.svg`.

### Wordmark
- Text is exactly **"Permanence IA"**. Never "PermanenceAI", "Permanence Ai", "Permanence I.A.".
- Manrope 700, letter-spacing −0.025em, line-height 1.
- "Permanence" in petrol `#0F3A48`; "IA" in turquoise `#2E9E98`, with extra left margin 0.22em beyond the normal word space.

### Horizontal lockup (primary)
- Symbol height = 1.25 × wordmark font-size; gap between symbol and text = 0.34em.
- Min lockup height: 24 px on screen (font-size ≈ 19.2 px), 6 mm in print.
- Vertical lockup: symbol 2.2em above the centered wordmark, gap 0.4em.
- Clear space: "x" = 2 × dot diameter on every side.

### Variants (bubble / wave / dot / text colors)
| Variant | Background | Bubble | Wave | Dot | "Permanence" | "IA" |
|---|---|---|---|---|---|---|
| A Primary | #FFFFFF or #F3F5F6 | #0F3A48 | #FFFFFF | #2E9E98 | #0F3A48 | #2E9E98 |
| C Mono black | white | #0B0B0B | #FFFFFF | #0B0B0B | #0B0B0B | #0B0B0B |
| D White on dark | #0F3A48 | #FFFFFF | #0F3A48 | #FFFFFF (or #7FCFC8) | #FFFFFF | #FFFFFF (or #7FCFC8) |
| E Dark mode | #0D1A1F | #E8F1F2 | #0D1A1F | #5FC4BB | #E8F1F2 | #5FC4BB |
| F App icon | #0F3A48 tile, radius ~23.7% | #FFFFFF | #0F3A48 | #7FCFC8 | — | — |
Wave color always equals the surface behind the symbol.

Symbol tested at 96, 64, 48, 32, 24, 16 px (favicon).

## Design Tokens
### Colors
| Token | Hex | Use |
|---|---|---|
| petrol | #0F3A48 | Primary brand, headings, buttons (RGB 15·58·72, CMYK ≈ 90·50·38·50, Pantone ≈ 7477 C) |
| petrol-2 | #0A2A35 | Footer / deeper surfaces |
| ink | #0B1D24 | Body text |
| turquoise | #2E9E98 | Accent: dot, active states, keywords (RGB 46·158·152, CMYK ≈ 74·10·44·0, Pantone ≈ 7472 C) |
| turquoise-soft | #7FCFC8 | Accent on petrol backgrounds |
| turquoise-tint | #E3F3F1 | Status pill background |
| white | #FFFFFF | Main surface |
| grey | #F3F5F6 | Secondary surface |
| grey-2 | #E4E9EB | Borders, dividers |
| mute | #5E7179 | Secondary text |
| night | #0D1A1F | Dark mode background |
| night-2 | #16262D | Dark mode raised surface |
| dark-accent | #5FC4BB | Dark mode turquoise |
Usage ratio: white 50 / grey 25 / petrol 17 / ink 5 / turquoise 3. Petrol on white contrast 11.9:1 (AAA). Pantone values are approximations — confirm with printer.

### Typography
- **Manrope** (Google Fonts, OFL) — weights 400, 500, 600, 700.
- **IBM Plex Mono** 400/500 — technical data only (phone numbers, times, invoice refs, labels uppercase 12px, letter-spacing .04em).
- Scale: Display 48–52 / 600–700 / −0.03 to −0.035em / lh 1.05–1.1 · H2 34 / 700 / −0.02em · Title 36 / 700 · Subtitle 22 / 600 · Body 16–18 / 400 / lh 1.55 · Small 13–14.

### Radius / shadow / spacing
- Radius: 3 px (bars), 6 px (panels/cards), 8 px (buttons), 10–12 px (chat cards, bubbles; speech bubble has 3 px on tail corner), 99 px (pills).
- Shadow (cards/print mockups): `0 12px 30px -12px rgba(11,29,36,.3)`.
- Board section padding 88 px × 96 px; grid gaps 20 px.

## Screens / Sections of the board
1. **Cover**: 2-col grid (1.25fr / 1fr, min-height 680). Left: lockup at 64px, claim 48px "L'accueil téléphonique de votre entreprise, tenu 24 h/24 par un agent vocal fiable." ("tenu 24 h/24" in turquoise). Right: petrol panel, 300px white symbol.
2. **Concept**: construction grid (12×12 on grey) + 4 pillars (bubble, wave, dot, continuity).
3. **Variants**: 3×2 grid of 260px tiles.
4. **Legibility**: size ladder + clear-space diagram.
5. **Palette**: 5 swatches + usage ratio bar.
6. **Typography**: specimen + scale table.
7. **Applications**:
   - Business card 85×55 mm: front = petrol, centered white lockup; back = white, symbol 26px top-left, name Manrope 700 14px, contact in Plex Mono 9.5px.
   - Email signature: 40px symbol | 1px divider | name bold petrol + "Permanence IA · permanenceia.com · phone" (domain turquoise 600).
   - Invoice A4: lockup top-left, 2px petrol rule, grey table header, petrol total box, mono footer.
   - Mobile app: header lockup + "En ligne" pill (turquoise-tint bg, turquoise dot), KPI "14 appels traités", event cards (urgent card has 1.5px turquoise inset outline).
   - Website hero: nav (lockup 21px, links, ghost + primary buttons radius 8), pill "Agent disponible · 24 h/24 · 7 j/7", H1 52px "Chaque appel reçoit une réponse.", chat transcript card (agent bubbles white, caller bubbles petrol).
   - Ads: petrol poster "Votre standard ne ferme jamais." and grey banner "Il est 3 h du matin. On décroche." with sector chips.
8. **Misuse**: wrong name, off-palette colors, distortion, busy background.

## Interactions & Behavior
Static brand board — no interactions. For the product UI derived from it: buttons darken petrol slightly on hover (suggest #0A2A35), focus ring 2px turquoise; the availability dot may pulse gently (opacity 1→.6, 2s ease-in-out) in live-status contexts only — never in the logo itself.

## State Management
None for the board.

## Assets
- `assets/symbol.svg` — canonical primary symbol (final vector). Generate other variants by swapping fills per the Variants table. Export PNGs (16/32/48/180/192/512) for favicon/app icons from this file.
- Fonts via Google Fonts: Manrope, IBM Plex Mono.
- No raster images used.

## Files
- `Permanence IA — Planche identité.html` — full brand board (the `mark()` JS function at the bottom generates all SVG variants).
- `assets/symbol.svg` — logo symbol.
