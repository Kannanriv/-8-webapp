# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing website for **#8 ("Hash Eight")**, an operations-driven IoT platform. Static HTML/CSS/vanilla JS: no build step, no package manager, no dependencies, no tests or linter. `PLAN.md` is the design brief and revision log (positioning, design tokens, page architecture, motion rules) — read it before making design or copy changes, and append a new "Revision" section when making substantial changes.

## Running

Open the HTML files directly, or serve the folder statically, e.g. `python -m http.server 8000`. Deployed on Vercel as a static site (`.vercel/` is linked to project `hash8-webapp`; `.vercel` and `.env*` are gitignored).

## Pages and script wiring

Each page loads plain `<script>` tags in a fixed order; later scripts read globals set by earlier ones, so order matters:

| Page | CSS | Scripts (in order) |
|---|---|---|
| `index.html` | `styles.css`, `studio.css` | `products.js` → `market-data.js` → `hero.js` → `main.js` → `studio.js` |
| `marketplace.html` | `styles.css`, `market.css` | `products.js` → `market-data.js` → `market.js` |
| `app.html` | `styles.css`, `app.css` | `products.js` → `hero.js` → `app.js` |

`styles.css` holds the shared design tokens (`:root` custom properties) and base components; the other CSS files are page/feature-specific.

## Shared data (globals on `window`)

- `HASH8_PRODUCTS`, `HASH8_AEP` (`products.js`) — single source of truth for the eight products + AEP. Each has a `url` (currently `app.html?app=<slug>`) to swap for real app URLs later, and `worksWith` (which products it hands work to, used by the ecosystem diagram).
- `HASH8_MARKET`, `HASH8_TYPES`, `HASH8_KITS`, `HASH8_ART(kind)`, `HASH8_CARD(m)` (`market-data.js`) — sample Marketplace listings, outcome kits and inline-SVG line art. Shared by the homepage Marketplace spotlight, the Outcome Studio and `marketplace.html`.
- `HASH8_LOOP(canvas, opts)` (`hero.js`) — the figure-8 particle canvas, reused by the hero and `app.html`.

Other modules are IIFEs that consume these globals with `|| []` fallbacks.

## Feature modules

- `main.js` — homepage sections (nav/mega menu, The Shift toggle, product suite, ecosystem diagram, the Loop, Live Ops map, industries rail, Marketplace spotlight, lead form). Sections are delimited by `/* ---- Name ---- */` comments.
- `studio.js` — the AEP **Outcome Studio**, a six-step flow (Outcome → Blueprint → Devices → Automate → Brand → Go live) driven by a single state object `S` and re-rendered by renderer functions. Outcome blueprints (needed apps, recommended devices, workflows, keyword `match` regex) live in `BLUEPRINTS`; typed outcomes fall back to `customBlueprint()`.
- `market.js` — Marketplace search/filter/sort, detail dialog, cart + quote, kits, seller flow. Deep links: `marketplace.html#item-<id>`; product deep links on the homepage: `index.html#product-<slug>`.
- `app.js` — per-product launch gateway page selected by `?app=<slug>`.
- `marketplace-lux.js` / `marketplace-lux.css` — the light homepage Marketplace section (film loop with chapters, five-aisle bento, light restyle of the `#show` spotlight, buyers/sellers panels). Aisles link to `marketplace.html?type=<type>#browse`, which `market.js` reads as the initial category filter.

## Films (`film/`)

Marketing videos are HTML pages where every frame is a pure function of time (`window.seek(t)`), exported frame by frame through headless Edge + ffmpeg:
- `film/aep-film.html` → `node film/render.js <ffmpeg.exe>` → `assets/video/aep-how-it-works.mp4`; `node film/music.js <ffmpeg.exe>` adds the synthesised soundtrack.
- `film/market-film.html` → `node film/render-market.js <ffmpeg.exe>` → `assets/video/marketplace.mp4` + poster (30 s silent loop). Chapter times in `marketplace-lux.js` must match its scene timings.

ffmpeg comes from `pip install imageio-ffmpeg`. Open a film page directly in a browser to preview it playing in real time.

## Design and motion rules (from PLAN.md)

- The figure-8 / loop is the motion system; animation should carry meaning (things flowing through an operational loop), not decorate every section.
- Animate only `transform`/`opacity`; ease `cubic-bezier(0.23,1,0.32,1)`; UI transitions ≤300ms; never `transition: all`; gate hover effects behind `(hover:hover) and (pointer:fine)`.
- Honour `prefers-reduced-motion` (JS checks `reduceMotion`; keep opacity, drop movement). Use IntersectionObserver and run `requestAnimationFrame` loops only while visible.
- Use the existing color tokens (Obsidian, Porcelain, Signal, Ion, Ember, Graphite) and the three radii (28px panels, 14px controls, 999px pills). Single font family: Inter Tight.
- Responsive down to 360px, visible focus rings, WCAG AA contrast. Copy is plain and user-perspective.
