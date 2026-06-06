import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import("@sveltejs/vite-plugin-svelte").SvelteConfig} */
export default {
  // loadPaths lets our SCSS resolve `@import 'axlothecook-sass-library/...'`
  // from node_modules (same pattern as the gaming-shop frontend). Components
  // reach the shared lib-backed breakpoint helpers via a relative `@use`
  // ('../../styles/responsive'), which `@forward`s the library's breakpoints.
  preprocess: vitePreprocess({
    scss: {
      loadPaths: ['node_modules'],
    },
  }),
}
