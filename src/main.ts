import { mount } from 'svelte'

// Fonts (self-hosted via @fontsource). Manrope is the active font; Space
// Grotesk is kept as a backup candidate. The active one is chosen by
// --font-primary in index.scss. Weights used: 300 / 400 / 500 / 600.
import '@fontsource/manrope/300.css'
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/500.css'
import '@fontsource/manrope/600.css'
import '@fontsource/space-grotesk/300.css'
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'

import './styles/index.scss'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
