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
- **Bottom-right motif:** a few thin **vertical sticks of varying height, each
  topped with a dot**.
  - The dot on the **tallest** stick **slowly bobs up and down** (looping).
  - On the non-Welcome slides the sticks **lower and grow** so they sit out of
    the way of the text (a "lowering + growing" animation on slide change).

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

- `+` mark: continuous spin (loop).
- Tallest bottom-right dot: slow up/down bob (loop).
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
