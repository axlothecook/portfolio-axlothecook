# portfolio-axlothecook

My personal portfolio website. A static, no-backend, **single-page slide-based**
site (Welcome → Projects → Skills & Tools → About) that displays my projects,
skills, and background. It opens with a GSAP "wizard" load animation that builds
the page furniture, and has a light/dark theme toggle plus a placeholder
"Animated" mode (a richer Three.js-style render planned for later).

**Live:** https://portfolio.axlothecook.com (Cloudflare Pages, auto-deploys on push to `main`)

## Design

[Click here](https://www.figma.com/design/Yc4OGKSCCefIzgg2P9tXu6/Portfolio-Website?node-id=3-73&t=ALfNXldsPVyxVNo5-0)
to view the Figma design for this website.

A fuller written spec (slide content, fixed shell, animations, colours) lives in
[`docs/design-spec.md`](docs/design-spec.md).

## Tech stack

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | **Svelte 5** (plain, not SvelteKit) | Static site, no routing/SSR needed; lighter than SvelteKit. |
| Bundler | **Vite 8** | Fast dev server + build. |
| Language | **TypeScript** | Type safety. |
| Styling | **Scoped SCSS** + [`axlothecook-sass-library`](https://github.com/axlothecook/axlothecook-sass-library) | Svelte scopes `<style>` natively; my own SCSS library provides the component/utility/colour system. No CSS-in-JS lib needed. |
| 3D (later) | **Three.js** | Planned hero/background render for the "Animated" mode. (Three.js / Threlte already ships in production in the Archery project — the interactive 3D bow viewer.) |

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

## Deployment — Cloudflare Pages

The site is a plain Svelte 5 + Vite **static SPA** (no SvelteKit, no client-side
router — a single `index.html`), hosted on **Cloudflare Pages** at
`portfolio.axlothecook.com` (subdomain of the Cloudflare-managed `axlothecook.com`).

One-time setup in the Cloudflare dashboard → **Workers & Pages → Create → Pages
→ Connect to Git**:

| Setting | Value |
| --- | --- |
| Repository | `axlothecook/portfolio-axlothecook` |
| Production branch | `main` |
| Framework preset | None (or "Vite") |
| Build command | `npm run build` |
| Build output directory | `dist` |

Then **Custom domains → Set up a custom domain → `portfolio.axlothecook.com`**
(Cloudflare auto-creates the DNS record + TLS since the zone is already on
Cloudflare). After that, every push to `main` auto-builds and deploys.

No `_redirects` / SPA fallback is needed — there is only the `/` route.

## TODO

- [x] Welcome load animation (GSAP), light/dark theme toggle, placeholder Animated mode.
- [x] Slides built from typed data (`src/data/{projects,skills,about}.ts`) + monochrome tech-icon components.
- [x] Project info: hover popup with summary + live/repo links (desktop) and a
      tap-to-open modal (mobile).
- [x] Responsive / mobile-friendly: horizontal-split layout, swipe slides, mobile
      load intro, sized/centred text, scroll hints, project modal.
- [x] Maximize use of the `axlothecook-sass-library` — all media queries now go
      through its breakpoint mixins (`src/styles/_responsive.scss`).
- [x] Trim the CSS bundle — dropped the full library `@import` (kept only the
      breakpoint mixins): **2.5 MB → 54 kB**.
- [x] Deploy to `portfolio.axlothecook.com` (Cloudflare Pages — auto-deploys on push to `main`).
- [ ] Three.js render for the "Animated" mode (post-launch).
