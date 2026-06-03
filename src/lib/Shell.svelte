<script lang="ts">
  // The fixed shell: stays on screen across all slides. Slide content is
  // rendered into the center region via the default <slot />.
  // The bottom-center indicator is still a placeholder — it shows the active
  // slide position, so it gets wired up in feat/slides.
  import Toggle from './Toggle.svelte'
  import Sticks from './Sticks.svelte'
</script>

<div class="shell">
  <!-- thin full-height bar down the far-left edge (#34302d) -->
  <div class="left-bar"></div>

  <!-- corners + edges (fixed to the viewport) -->
  <div class="region top-left">
    <span class="plus"></span>
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
  <div class="region bottom-center">[indicator]</div>
  <div class="region bottom-right"><Sticks /></div>

  <!-- center: vertical divider + slide content -->
  <div class="center">
    <div class="divider"></div>
    <div class="slot">
      <slot />
    </div>
  </div>
</div>

<style lang="scss">
  .shell {
    position: relative;
    min-height: 100vh;
    width: 100%;
    overflow: hidden;
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

  // Placeholder-only regions still get dimmed until their real content lands.
  .bottom-center {
    opacity: 0.5;
  }

  .top-left {
    top: 2rem;
    left: 3.75rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
  }

  // The "+" mark: a vertical bar with a horizontal crossbar pseudo-element.
  .plus {
    position: relative;
    width: 6px;
    height: 48px;
    background-color: var(--color-ink);

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 48px;
      height: 6px;
      background-color: var(--color-ink);
    }
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
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
  }

  .bottom-right {
    bottom: 0;
    right: 10rem;
  }

  // Center region: divider sits left of the slide content, both pushed toward
  // the right half of the screen (as in the Figma).
  .center {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    padding-left: 50%; // content lives in the right half
  }

  .divider {
    width: 2px;
    align-self: stretch;
    max-height: 18rem;
    margin: auto 0;
    background-color: var(--color-ink);
  }

  .slot {
    flex: 1;
  }
</style>
