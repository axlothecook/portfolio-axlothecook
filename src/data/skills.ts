// Skills shown on the Skills & Tools slide.
//
// NOT FINALIZED — some skills are missing; edit/add/remove freely. Each entry
// is one line: an optional `label` (e.g. "JS (ES5 / ES6)", "WebGL") and the
// `items` listed after it.

export interface SkillGroup {
  label?: string
  items: string
}

export const skills: SkillGroup[] = [
  { label: 'JS (ES5 / ES6)', items: 'Node.js, Express.js, Typescript' },
  { items: 'Regex' },
  { label: 'WebGL', items: 'Three.js' },
  { label: 'Animation', items: 'GSAP' },
]
