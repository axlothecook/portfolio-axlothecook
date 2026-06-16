// Registry mapping each project `Tech` value to its icon component. Each icon is
// its OWN component in this folder (currentColor + a `size` prop), so they're
// monochrome and follow the theme. Used by ProjectsSlide for the tech badges.
import type { Component } from 'svelte'
import type { Tech } from '../../data/projects'

import TypeScriptIcon from './TypeScriptIcon.svelte'
import JavaScriptIcon from './JavaScriptIcon.svelte'
import Css3Icon from './Css3Icon.svelte'
import SassIcon from './SassIcon.svelte'
import GulpIcon from './GulpIcon.svelte'
import SvelteIcon from './SvelteIcon.svelte'
import ReactIcon from './ReactIcon.svelte'
import ThreeJsIcon from './ThreeJsIcon.svelte'
import PostgreSQLIcon from './PostgreSQLIcon.svelte'
import PrismaIcon from './PrismaIcon.svelte'
import MongoDBIcon from './MongoDBIcon.svelte'
import ApiIcon from './ApiIcon.svelte'
import ArchIcon from './ArchIcon.svelte'
import PopOsIcon from './PopOsIcon.svelte'
import RaspberryPiIcon from './RaspberryPiIcon.svelte'
import CloudflareIcon from './CloudflareIcon.svelte'
import DockerIcon from './DockerIcon.svelte'
import TailwindIcon from './TailwindIcon.svelte'
import MuiIcon from './MuiIcon.svelte'
import ExpressIcon from './ExpressIcon.svelte'
import SupabaseIcon from './SupabaseIcon.svelte'
import GitHubActionsIcon from './GitHubActionsIcon.svelte'
import GoogleTranslateIcon from './GoogleTranslateIcon.svelte'
import GoogleMapsIcon from './GoogleMapsIcon.svelte'
import YouTubeIcon from './YouTubeIcon.svelte'
import BrevoIcon from './BrevoIcon.svelte'

export interface IconProps {
  size?: number | string
}

// Tech -> icon component + accessible label.
export const techIcons: Record<Tech, { component: Component<IconProps>; label: string }> = {
  TS: { component: TypeScriptIcon, label: 'TypeScript' },
  JS: { component: JavaScriptIcon, label: 'JavaScript' },
  CSS3: { component: Css3Icon, label: 'CSS3' },
  Sass: { component: SassIcon, label: 'Sass' },
  Gulp: { component: GulpIcon, label: 'Gulp' },
  Svelte: { component: SvelteIcon, label: 'Svelte' },
  React: { component: ReactIcon, label: 'React' },
  Three: { component: ThreeJsIcon, label: 'Three.js' },
  PostgreSQL: { component: PostgreSQLIcon, label: 'PostgreSQL' },
  Prisma: { component: PrismaIcon, label: 'Prisma' },
  MongoDB: { component: MongoDBIcon, label: 'MongoDB' },
  API: { component: ApiIcon, label: 'API' },
  Arch: { component: ArchIcon, label: 'Arch Linux' },
  PopOS: { component: PopOsIcon, label: 'Pop!_OS' },
  RaspberryPi: { component: RaspberryPiIcon, label: 'Raspberry Pi' },
  Cloudflare: { component: CloudflareIcon, label: 'Cloudflare' },
  Docker: { component: DockerIcon, label: 'Docker' },
  Tailwind: { component: TailwindIcon, label: 'Tailwind CSS' },
  MUI: { component: MuiIcon, label: 'Material-UI' },
  Express: { component: ExpressIcon, label: 'Express' },
  Supabase: { component: SupabaseIcon, label: 'Supabase' },
  GoogleTranslate: { component: GoogleTranslateIcon, label: 'Google Translate' },
  GoogleMaps: { component: GoogleMapsIcon, label: 'Google Maps' },
  YouTube: { component: YouTubeIcon, label: 'YouTube' },
  Brevo: { component: BrevoIcon, label: 'Brevo' },
  // Turnstile has no standalone logo — reuse the Cloudflare mark (it IS Cloudflare).
  Turnstile: { component: CloudflareIcon, label: 'Cloudflare Turnstile' },
  GitHubActions: { component: GitHubActionsIcon, label: 'GitHub Actions' },
}
