<script lang="ts">
  // The fixed shell: stays on screen across all slides. The scrolling slides
  // are passed in as children. The bottom-centre indicator shows the active
  // slide's position label, passed via the `indicator` prop.
  import Toggle from './Toggle.svelte'
  import ThemeToggle from './ThemeToggle.svelte'
  import Sticks from './Sticks.svelte'
  import Indicator from './Indicator.svelte'

  // The bottom-centre indicator shows the active slide's position label
  // (Welcome has no label; Projects=Top, Skills=Middle, About=Bottom).
  type Mode = 'straightforward' | 'animated'
  interface Props {
    mode?: Mode // current display mode (drives the toggle's active state)
    onModeChange?: (m: Mode) => void // called when the user clicks the toggle
    animatedLocked?: boolean // true during the load animation → Animated not yet clickable
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
    mode = 'straightforward',
    onModeChange,
    animatedLocked = false,
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

  // Scroll-position indicator inside the separator: a thinner inner line that
  // slides to Top / Middle / Bottom for the active section. Hidden on Welcome
  // (indicator === ''). Position derived from the active section label.
  const innerPos = $derived(
    indicator === 'Top' ? 'top' : indicator === 'Bottom' ? 'bottom' : 'middle',
  )
  const innerVisible = $derived(indicator !== '')
</script>

<div class="shell">
  <!-- centre divider: ONE element. On load it's a round ball that drops +
       bounces, then squashes and stretches its own body into the line (the ball
       melts into the line — same element throughout). -->
  <div class="divider-anchor">
    <div class="center-divider" bind:this={dividerEl}></div>
    <!-- scroll-position indicator: a thinner inner line (1/3 the separator's
         length) that slides to top/middle/bottom for the active section. Shown
         only off the Welcome slide. Overlaid on the separator, independent of
         the divider's load-animation transforms. -->
    <div class="inner-line" class:visible={innerVisible} data-pos={innerPos}></div>
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
    <div class="region top-center" bind:this={topBarEl}>
      <Toggle {mode} onChange={onModeChange} {animatedLocked} />
    </div>
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

  <!-- dark/light theme pill: OUTSIDE the furniture group so it's visible from the
       very START (before the ball drops) — not part of the furniture fade-in. It
       persists across every slide. Far top-right, past the sticks column. -->
  <div class="region top-right-theme"><ThemeToggle /></div>

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
    width: 6px;
    height: var(--divider-height);
    background-color: var(--color-ink);
    border-radius: 999px;
  }

  // Scroll-position indicator: a thinner inner line INSIDE the separator. Length
  // = 1/3 of the separator; coloured like the page bg so it reads as a moving
  // slot within the ink line. Slides to top/middle/bottom for the active section,
  // never closer than 5px to either end. Hidden (faded) on the Welcome slide.
  .inner-line {
    --inner-h: calc(var(--divider-height) / 3); // 1/3 the separator length
    --half: calc(var(--divider-height) / 2 - var(--inner-h) / 2 - 5px); // max travel (5px inset)

    position: absolute;
    top: 50%;
    left: 50%;
    width: 3px; // thinner than the 6px separator
    height: var(--inner-h);
    background-color: var(--color-bg);
    border-radius: 999px;
    opacity: 0;
    // centre it, then offset up/down per position (set below)
    transform: translate(-50%, -50%) translateY(0);
    transition:
      transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
      opacity 0.3s ease;
    pointer-events: none;
  }
  .inner-line.visible {
    opacity: 1;
  }
  .inner-line[data-pos='top'] {
    transform: translate(-50%, -50%) translateY(calc(var(--half) * -1));
  }
  .inner-line[data-pos='middle'] {
    transform: translate(-50%, -50%) translateY(0);
  }
  .inner-line[data-pos='bottom'] {
    transform: translate(-50%, -50%) translateY(var(--half));
  }

  // Thin full-height bar on the far-left edge. Uses the body ink colour so it
  // FOLLOWS the theme: brown #34302d in light mode, light #ececec in dark mode.
  .left-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 20px;
    height: 100%;
    background-color: var(--color-ink);
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
    z-index: 20; // above the animated-mode overlay so the toggle stays clickable
  }

  // Dark/light theme pill: far top-right, PAST the sticks column (which lives at
  // right: 10rem) — sits between the sticks and the edge, padded from the edge.
  // z-index above the slides/deck so it's actually clickable (the slides render
  // later in the DOM and would otherwise cover it).
  .top-right-theme {
    top: 1.5rem;
    right: 2.5rem;
    z-index: 5;
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

  // ---------------------------------------------------------------------------
  // MOBILE (≤768px): SAME layout as desktop — vertical divider, title left /
  // content right — just SHRUNK. The divider gets shorter + thinner, and every
  // decorative element (left wall, left/bottom-left dots, sticks + their dots,
  // the "+", the inner scroll indicator) is scaled down so the side-by-side
  // layout fits a phone without crowding.
  // ---------------------------------------------------------------------------
  @media (max-width: 768px) {
    // shorter divider on phones: --divider-height drives BOTH the line length and
    // the scrollable content height (Slide.svelte), so shrinking it here keeps
    // the line a sensible fraction of a short screen and shrinks the content box.
    .shell {
      --divider-height: 12rem; // ~192px (was 18rem) — fits a phone
    }
    // thinner vertical divider
    .center-divider {
      width: 4px;
      height: var(--divider-height);
    }

    // thinner inner scroll-indicator (still vertical: top/middle/bottom).
    .inner-line {
      width: 2px;
    }

    // slimmer left edge wall
    .left-bar {
      width: 10px;
    }

    // top-left "+" + dots: smaller and tighter to the corner, clear of the wall.
    .top-left {
      top: 1.25rem;
      left: 1.5rem;
      gap: 0.4rem;
    }
    .plus {
      width: 30px;
      height: 30px;
    }
    .top-left .dot {
      width: 6px;
      height: 6px;
    }
    .top-left .dots {
      gap: 4px;
    }

    // toggles pull in toward the edges (the pill itself is shrunk in Toggle.svelte)
    .top-center {
      top: 0.9rem;
    }
    .top-right-theme {
      top: 0.9rem;
      right: 1rem;
    }

    // bottom-left decorative dots: shrink (kept, not hidden).
    .bottom-left {
      bottom: 2.5rem;
      left: 1.5rem;
    }
    .bottom-left .dot {
      width: 6px;
      height: 6px;
    }
    .bottom-left .dots {
      gap: 4px;
    }

    .bottom-center {
      bottom: 1.5rem;
    }

    // bottom-right sticks: pull closer to the edge so they don't crowd the
    // content (they're scaled down via Sticks.svelte's own mobile rule).
    .bottom-right {
      right: 2rem;
    }
  }
</style>
