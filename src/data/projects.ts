// Projects shown on the Projects slide. The slide renders from this array.
// `tech` lists the tech badges (each maps to an icon in src/lib/icons). `summary`
// is the one-sentence text shown in the hover popup.

export type Tech =
  | 'TS'
  | 'JS'
  | 'CSS3'
  | 'Sass'
  | 'Gulp'
  | 'Svelte'
  | 'React'
  | 'Tailwind'
  | 'MUI'
  | 'Express'
  | 'PostgreSQL'
  | 'Prisma'
  | 'MongoDB'
  | 'Supabase'
  | 'GoogleTranslate'
  | 'GoogleMaps'
  | 'YouTube'
  | 'Brevo'
  | 'Turnstile'
  | 'API'
  | 'Docker'
  | 'GitHubActions'
  | 'Cloudflare'
  | 'RaspberryPi'
  | 'PopOS'
  | 'Arch'

export interface Project {
  name: string
  tech: Tech[]
  summary: string // hover popup — one sentence max
  // Per-project override for a badge's tooltip/aria label. Used when one icon
  // stands in for more than one tool in a project (e.g. Cloudflare covering both
  // Cloudflare and Turnstile), so the single badge can carry the merged label.
  techLabels?: Partial<Record<Tech, string>>
  ongoing?: boolean
}

export const projects: Project[] = [
  {
    name: 'Archery Club',
    // flagship full-stack: SvelteKit FE + TS/Express/Prisma/Postgres BE + Cloudflare R2,
    // self-hosted on a Raspberry Pi via a custom CI/CD pipeline.
    // Turnstile IS Cloudflare and reuses the same icon, so listing both rendered
    // the Cloudflare mark twice. Keep ONE Cloudflare badge and merge both labels
    // onto it via techLabels (below).
    tech: ['TS', 'Svelte', 'Sass', 'Express', 'Prisma', 'PostgreSQL', 'Cloudflare', 'GoogleTranslate', 'Brevo'],
    techLabels: { Cloudflare: 'Cloudflare (incl. Turnstile)' },
    summary:
      'Full-stack club website (SvelteKit + TypeScript/Express/Prisma/Postgres), self-hosted on my own Raspberry Pi through a custom CI/CD pipeline.',
  },
  {
    name: 'Gaming Shop',
    // Docker Compose + GitHub Actions CI/CD + GHCR + Cloudflare Tunnel, self-hosted on a Pi.
    tech: ['TS', 'Svelte', 'Sass', 'Express', 'MongoDB', 'Docker', 'GitHubActions', 'Cloudflare', 'RaspberryPi'],
    summary:
      'An e-commerce shop deployed to my own Raspberry Pi via Docker, a GitHub Actions CI/CD pipeline and a Cloudflare Tunnel.',
  },
  {
    name: 'Google Drive Clone',
    // Small-Google-Drive: Express + Prisma + Postgres + Supabase storage + Passport auth.
    tech: ['JS', 'Express', 'Prisma', 'PostgreSQL', 'Supabase'],
    summary:
      'A Google-Drive-style file manager with authentication and cloud storage, built on Express, Prisma/PostgreSQL and Supabase.',
  },
  {
    name: 'CV Maker',
    // Create_Resume: React + MUI FE, Express + Mongo BE, auth, PDF export; Pi + CI/CD.
    tech: ['JS', 'React', 'MUI', 'Express', 'MongoDB', 'Docker', 'RaspberryPi'],
    summary:
      'A drag-and-drop résumé builder with live PDF export (React + MUI, Express + MongoDB), self-hosted on a Raspberry Pi.',
  },
  {
    name: 'Sass Library',
    // axlothecook-sass-library: published SCSS component library (Gulp build),
    // consumed by Archery FE, Gaming Shop FE, and this portfolio.
    tech: ['Sass', 'Gulp', 'CSS3'],
    summary:
      'A reusable SCSS component library (my own Tailwind/Bootstrap alternative), published on GitHub and used across my projects.',
  },
  {
    name: 'CityWeather',
    // React + Visual Crossing + Google Places/Maps + YouTube + Chart.js + Motion.
    // GoogleMaps + YouTube have logos; the generic API badge covers Visual Crossing.
    tech: ['JS', 'React', 'GoogleMaps', 'YouTube', 'API'],
    summary:
      'A weather dashboard orchestrating multiple third-party APIs (Visual Crossing, Google Places/Maps, YouTube) with charts and motion.',
  },
  {
    name: 'Memory Game',
    // ArknightsMemoryCardGame: React 19 + Tailwind + Vite + parallax tilt + remote image fetch.
    tech: ['JS', 'React', 'Tailwind', 'API'],
    summary:
      'An animated memory card game (React + Tailwind) that fetches character art remotely, with parallax-tilt card effects.',
  },
  {
    name: 'Linux Ricing',
    // creative/personal — Pop!_OS + Arch desktop customization.
    tech: ['PopOS', 'Arch'],
    summary: 'Custom Linux desktop setups (Pop!_OS and Arch) — an ongoing creative/configuration hobby.',
    ongoing: true,
  },
]
