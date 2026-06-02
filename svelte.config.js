import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import("@sveltejs/vite-plugin-svelte").SvelteConfig} */
export default {
  // loadPaths lets our SCSS resolve `@import 'axlothecook-sass-library/...'`
  // from node_modules (same pattern as the gaming-shop frontend).
  preprocess: vitePreprocess({
    scss: {
      loadPaths: ['node_modules'],
    },
  }),
}
