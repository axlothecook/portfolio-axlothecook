<script lang="ts">
  // The fixed shell: stays on screen across all slides. The scrolling slides
  // are passed in as children. The bottom-centre indicator shows the active
  // slide's position label, passed via the `indicator` prop.
  import Toggle from './Toggle.svelte'
  import Sticks from './Sticks.svelte'
  import Indicator from './Indicator.svelte'

  // The bottom-centre indicator shows the active slide's position label
  // (Welcome has no label; Projects=Top, Skills=Middle, About=Bottom).
  interface Props {
    indicator?: string
    indicatorEl?: HTMLElement // bound out so App can drive its fade via GSAP
    children?: import('svelte').Snippet
  }
  let { indicator = '', indicatorEl = $bindable(), children }: Props = $props()
</script>

<div class="shell">
  <!-- thin full-height bar down the far-left edge (#34302d) -->
  <div class="left-bar"></div>

  <!-- fixed centre divider: static across all slides, never animates -->
  <div class="center-divider"></div>

  <!-- corners + edges (fixed to the viewport) -->
  <div class="region top-left">
    <svg class="plus" viewBox="0 0 20 20" aria-hidden="true"><use href="#icon-plus" /></svg>
    <span class="dots">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </span>
  </div>
  <div class="region top-center"><Toggle /></div>
  <div class="region bottom-left">
    <span class="dots">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </span>
  </div>
  <div class="region bottom-center" bind:this={indicatorEl}>
    <Indicator label={indicator} />
  </div>
  <div class="region bottom-right"><Sticks /></div>

  <!-- the scrolling slides fill the centre (each slide owns its own divider) -->
  {@render children?.()}
</div>

<style lang="scss">
  .shell {
    position: relative;
    min-height: 100vh;
    width: 100%;
    overflow: hidden;
  }

  // Fixed centre divider — static across all slides, thicker than before.
  .center-divider {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 4px;
    height: var(--divider-height);
    background-color: var(--color-ink);
    z-index: 1;
  }

  // Thin full-height bar on the far-left edge (always #34302d, independent of
  // the switchable body ink colour).
  .left-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 20px;
    height: 100%;
    background-color: var(--color-ink-soft); // #34302d
  }

  .region {
    position: fixed;
    font-size: 0.85rem;
  }

  .top-left {
    top: 2rem;
    left: 3.75rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
  }

  // The "+" mark (SVG with rounded/thick legs). Will spin in feat/animations.
  .plus {
    width: 48px;
    height: 48px;
    color: var(--color-ink);
  }

  // The "⋮" mark: three stacked dots.
  .dots {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background-color: var(--color-ink);
  }

  .top-center {
    top: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
  }

  .bottom-left {
    bottom: 2rem;
    left: 3.75rem;
  }

  .bottom-center {
    bottom: 4rem; // higher up, off the very bottom
    left: 50%;
    transform: translateX(-50%);
  }


  .bottom-right {
    bottom: 0;
    right: 10rem;
  }
</style>
