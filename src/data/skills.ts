// Skills shown on the Skills & Tools slide.
//
// This is the FULL competency list — every industry-relevant tool used across all
// projects (not just the ones featured on the Projects slide). Curated to CV-worthy
// tools (no low-level middleware noise). Grouped by the standard CV categories
// (Languages · Frameworks · Styling · Backend · Data · DevOps · Testing · APIs · Tools).

export interface SkillGroup {
  label?: string
  items: string
}

export const skills: SkillGroup[] = [
  { label: 'Languages', items: 'JavaScript (ES6+), TypeScript, HTML5, SQL' },
  { label: 'Frameworks', items: 'Svelte / SvelteKit, React / React Router, Node.js, Express' },
  { label: 'Libraries', items: 'PDF generation (react-pdf), drag & drop (dnd-kit)' },
  { label: 'Styling', items: 'CSS3, Sass (own published library), Tailwind CSS, Material-UI' },
  { label: 'Animation', items: 'GSAP, Motion, View Transitions API' },
  { label: 'Databases', items: 'PostgreSQL, MongoDB' },
  { label: 'ORM / data', items: 'Prisma, Mongoose, REST APIs, Zod' },
  { label: 'Auth & security', items: 'Passport.js, JWT, argon2 / bcrypt, Helmet, rate limiting, Cloudflare Turnstile' },
  { label: 'Deployment', items: 'Docker & Compose, GitHub Actions, GHCR, Docker Buildx (multi-arch), Tailscale, SSH, Railway, Netlify' },
  { label: 'Cloud & storage', items: 'AWS S3 SDK, Cloudflare R2 & Tunnel, Supabase, Raspberry Pi (self-hosted)' },
  { label: 'Architecture', items: 'Shared-types package (monorepo-style), full-stack TypeScript, i18n' },
  { label: 'Testing', items: 'Unit, integration & E2E testing: Vitest, Jest, React Testing Library, Playwright, Supertest' },
  { label: 'APIs / services', items: 'Google Cloud Translation, Visual Crossing, Google Places / Maps, YouTube, Brevo (email), Chart.js' },
  { label: 'Build tools', items: 'Vite, Webpack, esbuild, Gulp, npm' },
  { label: 'Tooling', items: 'Git & GitHub, ESLint, Prettier, Claude / Claude Code' },
  { label: 'Design', items: 'Figma, OBS Studio' },
]
