# portfolio-axlothecook

My personal portfolio website. A static, no-backend, **single-page slide-based**
site (Welcome → Projects → Skills & Tools → About) that displays my projects,
skills, and background. It opens with a GSAP "wizard" load animation that builds
the page furniture, and has a light/dark theme toggle plus a placeholder
"Animated" mode (a richer Three.js-style render planned for later).

**Live (planned):** https://portfolio.axlothecook.com

## Design

The website follows this Figma design:

- **Figma:** https://www.figma.com/design/Yc4OGKSCCefIzgg2P9tXu6/Portfolio-Website?node-id=3-73&t=ALfNXldsPVyxVNo5-0

A fuller written spec (slide content, fixed shell, animations, colours) lives in
[`docs/design-spec.md`](docs/design-spec.md).

## Tech stack

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | **Svelte 5** (plain, not SvelteKit) | Static site, no routing/SSR needed; lighter than SvelteKit. |
| Bundler | **Vite 8** | Fast dev server + build. |
| Language | **TypeScript** | Type safety. |
| Styling | **Scoped SCSS** + [`axlothecook-sass-library`](https://github.com/axlothecook/axlothecook-sass-library) | Svelte scopes `<style>` natively; my own SCSS library provides the component/utility/colour system. No CSS-in-JS lib needed. |
| 3D (later) | **Three.js** | Planned hero/background render. |

### How the Sass library is wired in

Consumed the same way as the gaming-shop frontend, **without modifying the
library repo**:

1. Installed straight from GitHub as a dependency:
   `axlothecook-sass-library: github:axlothecook/axlothecook-sass-library`
2. `svelte.config.js` adds `vitePreprocess({ scss: { loadPaths: ['node_modules'] } })`
   so the library's `@import` paths resolve from `node_modules`.
3. `src/styles/index.scss` is the custom-styles entry: override library SCSS
   variables there (above the `@import`), then
   `@import 'axlothecook-sass-library/sass-library/index.scss'`.

### Build note

Vite 8 defaults to the Lightning CSS minifier, which rejects some modern
selectors the library ships (e.g. `::picker(select):popover-open`). The
config uses `cssMinify: 'esbuild'` (the Vite-documented fix); `esbuild` is a
dev dependency because Vite 8 no longer bundles it.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build to dist/
npm run preview  # preview the production build
npm run check    # svelte-check + tsc type checking
```

## Git workflow

- One **branch per feature**. Build on the branch, finish it, merge into
  `main`, delete the branch, push `main`.
- If work pauses on a feature to start another, the in-progress branch is left
  **unmerged and aside** — it is not merged until it's finished.

## TODO

- [x] Welcome load animation (GSAP), light/dark theme toggle, placeholder Animated mode.
- [x] Slides built from typed data (`src/data/{projects,skills,about}.ts`) + monochrome tech-icon components.
- [x] Project info: hover popup with summary + live/repo links (desktop) and a
      tap-to-open modal (mobile).
- [x] Responsive / mobile-friendly: horizontal-split layout, swipe slides, mobile
      load intro, sized/centred text, scroll hints, project modal.
- [ ] Maximize use of the `axlothecook-sass-library` (beyond plain CSS).
- [ ] Three.js render for the "Animated" mode.
- [ ] Restyle the `+` mark (Figma has thicker legs with rounded edges; current is a plain cross).
- [ ] Trim the library CSS bundle (currently the whole library ships, ~2.5 MB)
      via PurgeCSS or by importing only the partials actually used.
- [ ] Deploy to `portfolio.axlothecook.com`.
