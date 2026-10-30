# #8 — Marketing Website Plan

## 1. Brief
- **Company:** #8 ("Hash Eight") — end-to-end IoT platform company.
- **Audience:** CTOs, heads of operations, IoT product owners at utilities, fleet, cold chain, buildings, manufacturing, telecom.
- **Primary job of the site:** Persuade that #8 is the *operations-driven* IoT platform (not just another data dashboard) and route visitors into each product application via a CTA.
- **Positioning hook:** *Most IoT stops at the dashboard. #8 starts there.* Data-driven platforms show you a spike; #8 turns it into a ticket, a dispatched technician, an updated CRM record and a notified customer — automatically.
- **Tagline:** Connect. Control. Make it intelligent.

## 2. Skills applied (from skills.sh)
| Skill | What we take from it |
|---|---|
| anthropics/frontend-design | Ground visuals in the subject (the number 8 / the loop). Token system first. One orchestrated motion moment, not fade-in on every section. Avoid template chrome (all-caps eyebrows, acid-green-on-black, identical SaaS cards). Plain, user-perspective copy. |
| emilkowalski/emil-design-eng | Animate only `transform`/`opacity`. Strong custom ease-out `cubic-bezier(0.23,1,0.32,1)`. UI transitions ≤300ms, buttons `scale(.97)` on press. Hover gated behind `(hover:hover) and (pointer:fine)`. Staggers 30–80ms. Reduced-motion keeps opacity, removes movement. No `transition: all`. |
| vercel web-design-guidelines | Visible focus rings, semantic landmarks, contrast, responsive to 360px. |

**"Built better":** combine them into one rule set — *the brand mark is the motion system*. The figure-8 (∞ loop) is the hero, the product map, and the lifecycle diagram, so animation always carries meaning: things flowing through an operational loop.

## 3. Design tokens
| Token | Hex | Role |
|---|---|---|
| Obsidian | `#05060A` | Primary dark canvas (Tesla/Apple-style stage) |
| Porcelain | `#F4F2EE` | Light sections — alternating dark/light rhythm like apple.com |
| Signal | `#5B7CFF` | Connect — primary accent, links, CTAs |
| Ion | `#5EE6C8` | Intelligence — healthy/online state |
| Ember | `#FF8A4C` | Operations — alerts, tickets, action |
| Graphite | `#8A8F9C` | Secondary text |

- **Type:** one family, *Inter Tight* (display 600–700, tight tracking −0.04em; body 400). Scale: 14 / 16 / 20 / 28 / 44 / 72 / 128.
- **Radius:** 28px stage panels, 14px controls, 999px pills — three distinct values, not one-size-fits-all.
- **Signature gradient:** Signal → Ion → Ember along the loop only (not as wallpaper).

## 4. Page architecture (index.html)
```
[Nav: #8 | Platform  Products▾  Why #8  Industries | Launch console]

01 HERO (dark)       Live particle "8" — thousands of things flowing on a lemniscate,
                     cursor pulls them. "Connect. Control. Make it intelligent."
                     CTAs: Build without code / Explore products

02 THE SHIFT (light) Interactive toggle  [Data-driven | Operations-driven]
                     Same event (cold-room temp spike) → chart only  vs.
                     ticket → technician → customer notified → CRM updated.

03 AEP (dark)        Sticky scroll stage, 4 steps: Model → Connect → Automate → Launch.
                     A no-code builder mock assembles itself step by step;
                     final "Launch" ripples into a live app.

04 PRODUCTS (dark)   Eight products for #8. Left: selectable list.
                     Right: large stage with animated mini-UI, features, and
                     a CTA "Open <Product>" → app.html?app=<slug>

05 THE LOOP (light)  SVG figure-8 with 8 stations (Install, Connect, Monitor, Detect,
                     Ticket, Resolve, Engage, Learn). Scroll moves a pulse around it.

06 LIVE OPS (dark)   Streaming operations feed + world map of node pulses.

07 INDUSTRIES        Horizontal drag/scroll rail of 8 industries.

08 EVERYTHING IoT    Capability matrix: #8 one platform vs. stitched vendors.

09 FINAL CTA         "Launch your IoT application this week. Without a line of code."
[Footer]
```

## 4b. Revision 2: outcome-driven AEP and one ecosystem
- **AEP = Outcome Studio.** Visitors pick an outcome (cold chain, utilities, fleet, healthcare, manufacturing, buildings, agriculture) or type their own. The studio shows #8 assembling the full app from all eight products, then Customise (brand colour) → Launch & go live. Typed outcomes are matched to the closest industry blueprint by keyword, or get a custom blueprint.
- **Products → Ecosystem.** "Not eight products. One IoT ecosystem." An animated diagram follows one event (install → SIM → gateway → device → asset → ticket → CRM → customer app) through all eight products. Each product panel lists which products it "hands work to".
- **Industries** each have a line illustration with live IoT signals, plus a ninth "Your industry" card linking to the Outcome Studio.
- Blueprint data lives in `OUTCOMES` in `assets/js/main.js`.

## 5. Products & app routes (CTA targets, apps built later)
| # | Product | Route |
|---|---|---|
| 01 | Device Management | `app.html?app=device-management` |
| 02 | SIM Management | `app.html?app=sim-management` |
| 03 | Device Gateway | `app.html?app=device-gateway` |
| 04 | Asset Management | `app.html?app=asset-management` |
| 05 | IoT CRM | `app.html?app=iot-crm` |
| 06 | Notifications & Ticketing | `app.html?app=ticketing` |
| 07 | Device Installation App | `app.html?app=installation-app` |
| 08 | Customer Applications | `app.html?app=customer-apps` |
| ∞ | AEP — Application Enablement Platform | `app.html?app=aep` |

All product data lives in one file (`assets/js/products.js`) so routes can be swapped to real app URLs later in one place (`url` field).

`app.html` = premium launch gateway per product: product identity, what it does, "Sign in" (disabled until apps ship) + early-access form.

## 6. Tech
- Static HTML/CSS/vanilla JS, zero build step, zero dependencies (fast, deployable anywhere).
- Canvas 2D for hero particles (DPR-aware, paused off-screen, reduced-motion → static render).
- IntersectionObserver for reveals and scroll stages; `requestAnimationFrame` only while visible.

## 7. Quality floor
Responsive 360px → 4K · keyboard focus visible · `prefers-reduced-motion` honoured · WCAG AA contrast · Lighthouse-friendly (no heavy libs).

## 8. Files
```
index.html
app.html
assets/css/styles.css
assets/js/products.js
assets/js/hero.js
assets/js/main.js
assets/js/app.js
```
