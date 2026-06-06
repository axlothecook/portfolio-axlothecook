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
    dividerEl?: HTMLElement // bound out: the ball that melts into the line on load
    furnitureEl?: HTMLElement // bound out: shell furniture that fades in on load
    sticksEl?: HTMLElement // bound out: bottom-right sticks (drop in after the shot)
    topBarEl?: HTMLElement // bound out: the top-centre toggle pill (dragged in)
    leftBarEl?: HTMLElement // bound out: the far-left wall (dragged in from off-screen)
    plusEl?: SVGElement // bound out: the top-left "+" mark (assembled from balls, then spins)
    topDotsEl?: HTMLElement // bound out: the 3 dots under the "+" (assembled from rubble)
    bottomDotsEl?: HTMLElement // bound out: the bottom-left 3 dots (Newton's-cradle finale)
    children?: import('svelte').Snippet
  }
  let {
    indicator = '',
    indicatorEl = $bindable(),
    dividerEl = $bindable(),
    furnitureEl = $bindable(),
    sticksEl = $bindable(),
    topBarEl = $bindable(),
    leftBarEl = $bindable(),
    plusEl = $bindable(),
    topDotsEl = $bindable(),
    bottomDotsEl = $bindable(),
    children,
  }: Props = $props()
</script>

<div class="shell">
  <!-- centre divider: ONE element. On load it's a round ball that drops +
       bounces, then squashes and stretches its own body into the line (the ball
       melts into the line — same element throughout). -->
  <div class="divider-anchor">
    <div class="center-divider" bind:this={dividerEl}></div>
  </div>

  <!-- the far-left wall: OUTSIDE the furniture group so it isn't part of the
       furniture fade — the wizard DRAGS it in from off-screen left as its own
       beat (after the top bar). -->
  <div class="left-bar" bind:this={leftBarEl}></div>

  <!-- shell furniture that fades in on load (everything except the divider and
       the slides) -->
  <div class="furniture" bind:this={furnitureEl}>

    <!-- corners + edges (fixed to the viewport) -->
    <div class="region top-left">
      <svg class="plus" viewBox="0 0 20 20" aria-hidden="true" bind:this={plusEl}><use href="#icon-plus" /></svg>
      <span class="dots" bind:this={topDotsEl}>
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </span>
    </div>
    <div class="region top-center" bind:this={topBarEl}><Toggle /></div>
    <div class="region bottom-left">
      <span class="dots" bind:this={bottomDotsEl}>
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </span>
    </div>
    <div class="region bottom-center" bind:this={indicatorEl}>
      <Indicator label={indicator} />
    </div>
  </div>

  <!-- bottom-right sticks: OUTSIDE the furniture group — they stand on the floor.
       On load they start short + equal, hanging from the TOP of the screen, then
       FALL DOWN into this standing position when the wizard's ball hits them
       (animated from App's load timeline). -->
  <div class="region bottom-right" bind:this={sticksEl}><Sticks /></div>

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

  // Centring wrapper: holds the divider at the exact viewport centre so the
  // inner element can be transformed by GSAP without losing its position.
  .divider-anchor {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }

  // The divider line — also the ball on load (one element). On load App sets it
  // to a 14px circle, then animates width/height into the 4px×full-height line.
  // A pill border-radius gives the line rounded caps and the ball a full circle.
  .center-divider {
    width: 4px;
    height: var(--divider-height);
    background-color: var(--color-ink);
    border-radius: 999px;
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
    bottom: 4rem; // lifted 2rem up from the original 2rem
    left: 3.75rem;
  }

  .bottom-center {
    bottom: 4rem; // higher up, off the very bottom
    left: 50%;
    transform: translateX(-50%);
  }


  // Sticks stand on the floor, bottom-right.
  .bottom-right {
    bottom: 0;
    right: 10rem;
  }
</style>
