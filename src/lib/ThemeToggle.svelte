<script lang="ts">
  // Light/Dark theme pill — same look as the Straightforward/Animated mode pill.
  // Sets data-theme="dark" on <html> (read by the CSS variables in index.scss)
  // and persists the choice in localStorage so it survives reloads. This control
  // lives in the fixed shell, so it persists across every slide of the site.
  import { onMount } from 'svelte'

  type Theme = 'light' | 'dark'
  let theme: Theme = $state('light')

  // apply the theme to the document root + remember it
  function apply(next: Theme) {
    theme = next
    document.documentElement.dataset.theme = next === 'dark' ? 'dark' : ''
    try {
      localStorage.setItem('theme', next)
    } catch {
      // ignore storage errors (private mode etc.)
    }
  }

  function select(next: Theme) {
    if (next !== theme) apply(next)
  }

  onMount(() => {
    // restore the saved choice (default light) on first paint
    let saved: Theme = 'light'
    try {
      saved = (localStorage.getItem('theme') as Theme) || 'light'
    } catch {
      saved = 'light'
    }
    apply(saved)
  })
</script>

<!-- Sliding switch: a pill track with a round knob that slides left (light) /
     right (dark). Track + knob colours flip with the theme. -->
<button
  class="switch"
  class:dark={theme === 'dark'}
  onclick={() => select(theme === 'dark' ? 'light' : 'dark')}
  role="switch"
  aria-checked={theme === 'dark'}
  aria-label="Toggle dark mode"
>
  <span class="knob"></span>
</button>

<style lang="scss">
  // The track: a full pill. Knob is inset with even padding all around.
  .switch {
    --track-w: 52px;
    --track-h: 26px;
    --pad: 4px; // even gap between the knob and the track edges
    --knob: calc(var(--track-h) - var(--pad) * 2);

    box-sizing: border-box;
    width: var(--track-w);
    height: var(--track-h);
    padding: var(--pad);
    border: none;
    border-radius: 999px; // full pill
    background-color: #34302d; // LIGHT mode: dark track (knob is light)
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    transition: background-color 0.25s ease;
  }

  // The knob: a round dot inset from the edges; slides between the two ends.
  .knob {
    width: var(--knob);
    height: var(--knob);
    border-radius: 50%;
    background-color: #ececec; // LIGHT mode: light knob on dark track
    transition:
      transform 0.25s ease,
      background-color 0.25s ease;
    transform: translateX(0); // light = knob LEFT
  }

  // DARK mode: track flips light, knob flips dark, knob slides RIGHT.
  .switch.dark {
    background-color: #ececec;
  }
  .switch.dark .knob {
    background-color: #34302d;
    transform: translateX(calc(var(--track-w) - var(--knob) - var(--pad) * 2));
  }
</style>
