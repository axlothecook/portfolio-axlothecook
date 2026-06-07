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
  summary: string // hover popup text (one or two short sentences)
  liveUrl?: string // link to the deployed site (omit if not deployed / no demo)
  repoUrl?: string // link to the GitHub repo (omit if not public yet)
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
    // summary describes WHAT the project is; the tech badges cover the stack, so
    // no tool names here (CI/CD is kept as a concept, not a tool). The "Live" /
    // "Code" links are rendered from liveUrl/repoUrl, not written in the summary.
    summary:
      'A full-stack website built for adoption by an official archery club in Croatia, with a public site and a private dashboard for admins. Self-hosted on a Pi through a containerised custom CI/CD pipeline.',
    // liveUrl + repoUrl pending (not deployed yet / repo link to be provided).
  },
  {
    name: 'Gaming Shop',
    // Docker Compose + GitHub Actions CI/CD + GHCR + Cloudflare Tunnel, self-hosted on a Pi.
    tech: ['TS', 'Svelte', 'Sass', 'Express', 'MongoDB', 'Docker', 'GitHubActions', 'Cloudflare', 'RaspberryPi'],
    summary:
      'A full-stack e-commerce shop demo. Self-hosted on a Pi through a containerised custom CI/CD pipeline.',
    liveUrl: 'https://gameshop.axlothecook.com',
    repoUrl: 'https://github.com/axlothecook/gameshop',
  },
  {
    name: 'Google Drive Clone',
    // Small-Google-Drive: Express + Prisma + Postgres + Supabase storage + Passport auth.
    tech: ['JS', 'Express', 'Prisma', 'PostgreSQL', 'Supabase'],
    summary:
      'A Google-Drive-style file manager with user authentication and cloud file storage.',
    liveUrl: 'https://small-google-drive-production.up.railway.app/',
    repoUrl: 'https://github.com/axlothecook/Small-Google-Drive',
  },
  {
    name: 'CV Maker',
    // Create_Resume: React + MUI FE, Express + Mongo BE, auth, PDF export; Pi + CI/CD.
    tech: ['JS', 'React', 'MUI', 'Express', 'MongoDB', 'Docker', 'RaspberryPi'],
    summary:
      'A full-stack résumé builder with live PDF export used to create professional CVs with user authentication. Self-hosted on a Pi through a containerised custom CI/CD pipeline.',
    liveUrl: 'https://editcv.netlify.app',
    repoUrl: 'https://github.com/axlothecook/Create_Resume',
  },
  {
    name: 'Sass Library',
    // axlothecook-sass-library: published SCSS component library (Gulp build),
    // consumed by Archery FE, Gaming Shop FE, and this portfolio.
    tech: ['Sass', 'Gulp', 'CSS3'],
    summary:
      'A reusable component & utility library (my own styling-framework alternative), published and used across my projects.',
    // no live demo (it's a library); repo only.
    repoUrl: 'https://github.com/axlothecook/axlothecook-sass-library',
  },
  {
    name: 'CityWeather',
    // React + Visual Crossing + Google Places/Maps + YouTube + Chart.js + Motion.
    // GoogleMaps + YouTube have logos; the generic API badge covers Visual Crossing.
    tech: ['JS', 'React', 'GoogleMaps', 'YouTube', 'API'],
    summary:
      'A weather dashboard displaying data amongst which are images and walking tours of searched places, interactive charts and motion. Delivered through multiple APIs, like Visual Crossing.',
    liveUrl: 'https://cityweatherforecastapp.netlify.app',
    repoUrl: 'https://github.com/axlothecook/CityWeather',
  },
  {
    name: 'Memory Game',
    // ArknightsMemoryCardGame: React 19 + Tailwind + Vite + parallax tilt + remote image fetch.
    tech: ['JS', 'React', 'Tailwind', 'API'],
    summary:
      'An animated memory card game that fetches character art remotely, with parallax-tilt card effects.',
    liveUrl: 'https://arknightsmemorycardgame.netlify.app/',
    repoUrl: 'https://github.com/axlothecook/ArknightsMemoryCardGame',
  },
  {
    name: 'Linux Ricing',
    // creative/personal — Pop!_OS + Arch desktop customization.
    tech: ['PopOS', 'Arch'],
    summary: 'Custom Linux desktop setups (Pop!_OS and Arch); an ongoing creative/configuration hobby.',
    ongoing: true,
  },
]
