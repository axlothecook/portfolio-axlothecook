# Portfolio — design spec

Captured from the Figma sketch + the user's notes. This is the source of truth
for what to build. Figma (login-gated):
https://www.figma.com/design/Yc4OGKSCCefIzgg2P9tXu6/Portfolio-Website?node-id=0-1&p=f&t=zlR7xG7nocVrjL9N-0

## Concept

A **single-page** site. A **fixed shell** stays on screen; only the **center
content panel** (and the bottom-right motif) changes as you scroll through a
small set of "slides". It is NOT a normal long-scroll page — the rest of the
page does not move.

## Fixed shell (present on every slide, does not change)

- **Top-left:** a `+` mark that **continuously spins**, with a `⋮` (three dots)
  below it.
- **Bottom-left:** a `⋮` (three dots).
- **Top-center:** a pill toggle labelled **"Straightforward / Animated"**.
  - It is an **interactive toggle**. For now only **Straightforward** mode is
    built; **Animated** mode comes WAY later, after the site is otherwise done.
- **Right region:** a tall thin **vertical divider line**; to its right sits the
  swapping content block.
- **Bottom-center:** a small position label / nav indicator (Top / Middle /
  Bottom — see ordering below).
- **Left edge:** a thin **full-height vertical bar** in `#34302d`, top to
  bottom, on the far left of every panel.
- **Bottom-right motif:** a few thin **vertical sticks of varying height, each
  topped with a dot**.
  - The dot on the **tallest** stick **slowly bobs up and down** (looping).
  - On the non-Welcome slides the sticks **lower and grow** so they sit out of
    the way of the text (a "lowering + growing" animation on slide change).

## Build decisions

- `+` mark and `⋮` dots: built with **pure CSS/HTML** (no image assets), so
  they stay crisp and are easy to animate later.
- Bottom-center indicator (Top/Middle/Bottom): **just a position label**, not
  clickable. Scroll drives navigation.
- Layout: **desktop-first** now (match the Figma); mobile breakpoints are a
  later task (no Figma mobile panels yet).

## Scroll mechanic + slide layout (decided)

- **Scroll-snap**: real full-height scroll sections under the fixed shell; wheel
  (desktop) and finger-swipe (phone) move through the centre content
  Welcome → Projects → Skills → About. CSS scroll-snap + IntersectionObserver
  tracks the active slide (drives the indicator + later animations).
- **Shared slide template**: big left-side title + content to the right of the
  divider, for all 4 slides (Welcome is the hero variant).
- **Projects overflow**: the project list may be long. The content box scrolls
  only IF it overflows (`overflow-y: auto`); nested-scroll handoff means you
  scroll the list first, then continued scrolling snaps to the next slide. The
  current 6 projects likely fit without inner scroll.
- **Welcome load animation**: the Welcome text animates in on page load (built
  in feat/slides per the user).

## Slides (center panel content)

1. **Welcome** (hero): big "Welcome" + divider + "To a place where projects of
   passion reside".
2. **Projects:** (left big title "Projects", list on the right of the divider)
   - Archery Club — TS, Svelte, MySQL, Three.js
   - SweetSpot — TS, Svelte, MySQL
   - CityWeather — JS, React, API
   - CV Maker — JS, React
   - Texting App — TS
   - Arch Linux Ricing — (ongoing)
3. **Skills & Tools:**
   - JS (ES5 / ES6): Node.js, Express.js, Typescript
   - Regex
   - WebGL: Three.js
   - Animation: GSAP
4. **About me:**
   - 📍 Netherlands
   - Contact: lana.segovic@gmail.com
   - Occupation: Full stack developer
   - Education: self-taught

## Ordering (user note #8)

The Figma labelled Projects as "Bottom" and About me as "Top"; the user wants
these SWITCHED so the order reads:

- **Projects = first**
- **Skills & Tools = middle**
- **About me = last**

**Welcome is a SEPARATE hero** (unlabelled intro, shown first). The three
labelled slides are the Top/Middle/Bottom rotation:

- **Top = Projects** (first)
- **Middle = Skills & Tools**
- **Bottom = About me** (last)

So the full scroll order is: Welcome (hero) → Projects → Skills & Tools → About me.

## Data-driven content (requirement)

Projects, skills, and about-me data are NOT finalized and will change. Build the
slides so content is **easy to add / remove / edit**:

- Content lives in typed data files (e.g. `src/data/projects.ts`,
  `src/data/skills.ts`, `src/data/about.ts`) as arrays/objects.
- Slide components render purely from that data — adding or removing a
  project/skill/about-field is a one-line data edit, no markup changes.
- Tech badges per project (TS, Svelte, MySQL, React, API, Three.js, ...) are
  also data, mapped to icons.

## Project hover popup (feature)

Hovering a project shows a small popup/tooltip with a **very short summary**
(a couple of words, max one sentence). So each project entry has a `summary`
field. Implement as an on-hover popover near the project row.

## Animations summary

- `+` mark: TODO restyle — current build is a plain thin cross; the Figma `+`
  has **thicker legs with rounded edges**. Polish the look later.
- `+` mark: continuous spin (loop). Clearance vs the left bar VERIFIED by a
  temporary spin test — at `left: 3.75rem`, size 48px, it clears the 20px bar.
  Speed pattern (slow→fast→slow over ~3s) does not affect clearance.
- Bottom-right dots: a **real ball-drop bounce**, ALL THREE dots (not just the
  tallest). Final previewed motion (CSS, to be rebuilt in GSAP):
  - Each dot: launch up decelerating to an apex of **−46px**, then a fast fall
    that accelerates into the tower top, bounce, repeat. Cycle ~**1.4s**.
  - Timing split ~**62% rise / 38% fall** (apex at 62%). Rise ease
    `cubic-bezier(0.15,0.6,0.35,1)`; fall ease `cubic-bezier(0.7,0,0.9,0.3)`.
  - **All balls share the exact same fall** (identical accel) — the ONLY
    per-ball difference is WHEN each launches (stagger via delay: tall=0s,
    left=0.5s, right=0.9s).
  - Temporary CSS preview lives in `Sticks.svelte` (`.bob` + `temp-ball-drop`)
    and MUST be removed before feat/layout-shell merges.
- Bottom-right sticks: lower + grow when leaving the Welcome slide.
- Center text: **show / disappear transition** when the slide content changes
  (going between slides).

## Colours (from the colour-scheme panel)

The panel gave TWO values for each of black and white — these are A/B test
pairs (the two Welcome screenshots were testing which pair to use).

- black pair: `#1e1f1c`, `#34302d`
- white pair: `#f3eee5` (warm cream), `#ececec` (neutral)

**Chosen starting palette (build with these):**

- **Background:** `#ececec`
- **Text (ink):** `#34302d` — but built so it can be EASILY switched to
  `#1e1f1c` (single CSS custom property `--color-ink`).
- **Navbar background:** `#d9d9d9` (slightly darker than the page bg).

## Not part of the design

- A blue element clipped at the bottom edge of some screenshots is a Figma
  cutoff, NOT a real element — ignore it.

## Tech for animations

- **GSAP** is the animation library for all standard motion (spin, dot bob,
  stick lower+grow, center-text show/disappear).
- **Three.js is NOT used for these.** Three.js is reserved for the future
  "Animated" mode panel only (built way later) — do not pull it in for the
  standard slide animations.
