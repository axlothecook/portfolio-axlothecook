import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    // Vite 8's default Lightning CSS minifier rejects some modern selectors the
    // sass-library ships (e.g. `::picker(select):popover-open`). The official
    // Vite-documented fix is to use the esbuild minifier instead, which tolerates
    // them. Vite 8 no longer bundles esbuild, so it's installed as a dev-dep.
    cssMinify: 'esbuild',
  },
})
