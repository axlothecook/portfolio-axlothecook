// Projects shown on the Projects slide.
//
// NOT FINALIZED — edit/add/remove entries freely; the slide renders from this
// array. `tech` lists the tech badges. `summary` is the short text shown in the
// hover popup (keep it to a couple of words / one sentence max).
//
// ⚠️ The `summary` values below are Lorem ipsum PLACEHOLDERS — replace each
// with real one-sentence copy before launch.

export type Tech =
  | 'TS'
  | 'JS'
  | 'Svelte'
  | 'React'
  | 'MySQL'
  | 'API'
  | 'ThreeJS'
  | 'Arch'

export interface Project {
  name: string
  tech: Tech[]
  summary: string // hover popup — one sentence max
  ongoing?: boolean
}

export const projects: Project[] = [
  {
    name: 'Archery Club',
    tech: ['TS', 'Svelte', 'MySQL', 'ThreeJS'],
    summary:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    name: 'SweetSpot',
    tech: ['TS', 'Svelte', 'MySQL'],
    summary:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    name: 'CityWeather',
    tech: ['JS', 'React', 'API'],
    summary:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    name: 'CV Maker',
    tech: ['JS', 'React'],
    summary:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    name: 'Texting App',
    tech: ['TS'],
    summary:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    name: 'Arch Linux Ricing',
    tech: ['Arch'],
    summary:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    ongoing: true,
  },
]

// TEMPORARY: duplicate the list so it overflows and the scroll behaviour is
// testable before real data exists. REMOVE this block once there are enough
// real projects.
projects.push(...projects.map((p) => ({ ...p })))
