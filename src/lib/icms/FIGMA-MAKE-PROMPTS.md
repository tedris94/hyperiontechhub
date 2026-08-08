# Figma Make prompts — Hyperion ICMS / Anas bn Malik

Attach logo: `public/tenants/anas-bn-malik/logo.png`  
Live reference (use while MCP OAuth is broken): http://localhost:3000/icms/anas-bn-malik  
Design tokens page: http://localhost:3000/icms/anas-bn-malik/design-system

---

## Prompt 1 — Design system + Home (run first)

You are a senior product designer for institutional / nonprofit websites (university + mosque hybrid). Design a premium UI kit and homepage for:

ANAS BN MALIK ISLAMIC CENTER
Motto: STRIVING IN THE CAUSE OF ALLAH
Address: AMSSCO Platinum City Estate, Plot 312 Galadimawa District, Abuja FCT
Phones: 08062252510, 08034416661

This is Tenant #1 of Hyperion ICMS (multi-tenant Islamic Center Management System). Design as a white-label tenant site, not a tech-startup landing page.

BRAND TOKENS
- Emerald #0F5A43 (primary)
- Forest #07382B (dark sections, footer)
- Gold #C79A2C (accents, rules, secondary emphasis)
- Ivory #FAF8F2 (page background)
- Charcoal #1E1E1E (body text)
- Warm gray #6F6F6F (muted)
Ratio: ~60% ivory, 25% emerald/forest, 10% gold, 5% gray/black.

TYPOGRAPHY
- Display / headings: Cinzel (Bold for H1, SemiBold for H2)
- UI / body: Montserrat (Regular, Medium, SemiBold)
- Arabic verses (if any): Amiri
Do NOT use Inter, Roboto, or generic AI purple themes.

LOGO
Use the uploaded Anas bn Malik Islamic Center logo. Provide lockups: full wordmark, stacked, mark-only. Brand must dominate the first viewport.

VISUAL LANGUAGE
Institutional heritage. Full-bleed architecture / mosque photography as the hero plane. Subtle Islamic geometric texture only as background grain — never loud. Gold hairline rules. Generous whitespace. Soft, restrained shadows.
AVOID: glassmorphism, purple gradients, floating badges/chips on hero, card grids in the hero, pill clusters, stat strips in the first viewport, neon glow, dark-mode-first UI.

CREATE PAGE: 00 Foundations
- Color swatches with hex labels
- Type specimens (Cinzel + Montserrat + Amiri)
- Logo lockups on ivory and on forest
- Spacing scale (4/8/12/16/24/32/48/64)
- Corner radius: 0–8px max (institutional, not bubbly)
- Components: Primary button (emerald), Secondary (gold outline), Ghost, Text fields, Nav link states, Footer block, Prayer-time strip, Event list row, Article teaser, Donate amount selector, Admin sidebar item, KPI metric

CREATE FRAME: Home — Desktop 1440
ONE composition first viewport only:
- Sticky nav: mark + “Anas bn Malik” · About · Mosque · Events · Waqf · Articles · Contact · Donate (gold/emerald CTA)
- Full-bleed hero (mosque/architecture), brand-forward
- One headline, one short supporting sentence, CTA group: “Donate” + “Prayer Times”
- Motto as quiet secondary line — do not overpower the brand name
NO prayer widgets, events, stats, or cards in the first viewport.

BELOW THE FOLD (same frame, scroll):
1) Today’s prayer times (Fajr–Isha) — clean horizontal strip, not cards
2) Upcoming events (3 rows)
3) Waqf highlight (one narrative block + CTA)
4) Latest articles (3 teasers)
5) Location / contact strip (Abuja address + phones)
6) Forest footer with motto, quick links, copyright

Also create Home — Mobile 390 matching the same structure.
Use Auto Layout everywhere. Name layers clearly. Light mode only.

---

## Prompt 2 — Remaining public pages

Continue in the same Anas bn Malik / Hyperion ICMS file. Reuse Foundations tokens, components, nav, and footer exactly. Desktop 1440. Light mode. Same brand rules: Cinzel + Montserrat, emerald/gold/ivory, no glassmorphism, no hero clutter.

Design these public pages for ANAS BN MALIK ISLAMIC CENTER (Abuja). Motto: STRIVING IN THE CAUSE OF ALLAH.

1) About — Mission/Vision columns, story, address
2) Leadership — Imams, Directors, Committee directory
3) Mosque & Prayer Times — overview + weekly table
4) Events — featured + list of 5
5) Donate — amounts, funds, trust line (demo mode)
6) Waqf — two projects with progress
7) Articles list + Article Detail
8) Contact — form, map placeholder, phones

Also create Donate — Mobile 390.
Name frames: Public / About, Public / Leadership, etc.

---

## Prompt 3 — Admin portal

Continue in the same file. Tenant Admin Portal (not Super Admin). Desktop 1440. Light mode.
Forest sidebar; ivory content. Montserrat UI; Cinzel sparingly for titles.

SHELL nav: Dashboard, Website, Articles, Events, Donations, Waqf, Prayer Times, Media, Leadership, Settings
Sidebar footer: Hyperion ICMS

SCREENS:
1) Admin / Dashboard — KPIs, prayer strip, recent donations, upcoming events
2) Admin / Articles — table + editor panel
3) Admin / Events — list + create form
4) Admin / Donations — metrics + table + “Presentation data” banner
5) Admin / Settings — logo, colors, motto, contact, domain anasbnmalik.hyperionicms.com

Wire sidebar prototype between these 5 screens.

---

## Prompt 4 — Cover + prototype

Cover frame: “Hyperion ICMS — Tenant Showcase: Anas bn Malik Islamic Center”
Wire Home → all public pages; Admin sidebar links.
