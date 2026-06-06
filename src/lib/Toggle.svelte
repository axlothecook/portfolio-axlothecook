<script lang="ts">
  // Mode toggle pill: "Straightforward" vs "Animated". The active mode is driven
  // by the parent (App) so it can switch the whole page. When "Animated" is the
  // selected option, its active background becomes moving, rainbow-cycling blobs.
  type Mode = 'straightforward' | 'animated'

  interface Props {
    mode?: Mode
    onChange?: (m: Mode) => void
    animatedLocked?: boolean // true while the load animation is still running
  }
  let { mode = 'straightforward', onChange, animatedLocked = false }: Props = $props()

  function select(next: Mode) {
    // Animated can't be chosen until the front-page load animation has finished.
    if (next === 'animated' && animatedLocked) return
    if (next !== mode) onChange?.(next)
  }
</script>

<div class="toggle" role="group" aria-label="Display mode">
  <button class="option" class:active={mode === 'straightforward'} onclick={() => select('straightforward')}>
    <span class="label">Straightforward</span>
  </button>
  <button
    class="option animated-opt"
    class:active={mode === 'animated'}
    class:locked={animatedLocked}
    onclick={() => select('animated')}
    aria-disabled={animatedLocked}
    title={animatedLocked ? 'Available after the intro' : 'Animated'}
  >
    <!-- rainbow blobs squeezed together to fill the pill background; they sit
         still and cycle through every colour. Shown only when this is active. -->
    <span class="blobs" aria-hidden="true">
      <span class="blob b1"></span>
      <span class="blob b2"></span>
      <span class="blob b3"></span>
      <span class="blob b4"></span>
      <span class="blob b5"></span>
      <span class="blob b6"></span>
      <span class="blob b7"></span>
      <span class="blob b8"></span>
      <span class="blob b9"></span>
    </span>
    <!-- frosted glass cover ON TOP of the blobs (glassmorphism: blurs them) -->
    <span class="glass" aria-hidden="true"></span>
    <span class="label">Animated</span>
  </button>
</div>

<style lang="scss">
  @use '../styles/responsive' as r; // lib-backed breakpoint mixins

  .toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    background-color: var(--color-navbar); // #d9d9d9
    border-radius: 999px;
    padding: 0.4rem 0.6rem;
  }

  .option {
    position: relative;
    border: none;
    background: transparent;
    color: var(--color-ink);
    font: inherit;
    font-size: 0.95rem;
    padding: 0.3rem 0.9rem;
    border-radius: 999px;
    cursor: pointer;
    overflow: hidden; // clip the blobs to the pill shape
    // smooth the active-state change (fill + text colour)
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
  }

  // The label sits above the blobs AND the frosted glass cover.
  .label {
    position: relative;
    z-index: 2;
    transition: color 0.3s ease;
  }

  // The currently selected option gets a subtle filled look (Straightforward).
  .active {
    background-color: rgba(255, 255, 255, 0.5);
  }

  // Animated is not selectable until the load animation finishes: show the
  // "banned" cursor and dim it slightly.
  .animated-opt.locked {
    cursor: not-allowed;
    opacity: 0.55;
  }

  // When ANIMATED is active: dark base, rainbow blobs, then a frosted-GLASS cover
  // over them (glassmorphism, like css.glass) and the label on top.
  .animated-opt.active {
    background-color: #2a2630; // dark base behind the blobs
  }
  .animated-opt.active .label {
    color: #fff;
  }

  // The blob layer — hidden unless the Animated option is active (fades in/out).
  .blobs {
    position: absolute;
    inset: 0;
    z-index: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.35s ease;
  }
  .animated-opt.active .blobs {
    opacity: 1;
  }

  // Frosted glass cover sitting ABOVE the blobs: backdrop-filter blurs the blobs
  // beneath it, a translucent white tint + light rim give the glassmorphism look.
  .glass {
    position: absolute;
    inset: 0;
    z-index: 1; // above blobs (z 0), below label (z 1 too — order keeps label last)
    opacity: 0;
    pointer-events: none;
    border-radius: inherit;
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(5px) saturate(1.5);
    -webkit-backdrop-filter: blur(5px) saturate(1.5);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.3);
    transition: opacity 0.35s ease;
  }
  .animated-opt.active .glass {
    opacity: 1;
  }

  // Blobs sit STILL, scattered randomly and overlapping so they fill the whole
  // pill background with no gaps. Each has its own SIZE, organic SHAPE (asymmetric
  // border-radius) and colour, and all cycle through EVERY colour (full hue wheel,
  // never black or white since they're vivid hsl).
  .blob {
    position: absolute;
    filter: blur(1px);
    animation: hue 7.5s linear infinite;
  }
  // scattered RANDOMLY across the pill (no row/grid pattern); they overlap so
  // there are no gaps. Varied size + shape + colour.
  .blob.b1 {
    left: -8%;
    top: -10%;
    width: 28px;
    height: 28px;
    background: hsl(0 95% 58%);
    border-radius: 75% 25% 70% 30% / 60% 65% 35% 40%;
    animation-delay: 0s;
  }
  .blob.b2 {
    left: 14%;
    top: 30%;
    width: 24px;
    height: 30px;
    background: hsl(40 95% 55%);
    border-radius: 50% 50% 30% 70% / 70% 30% 70% 30%;
    animation-delay: -0.8s;
  }
  .blob.b3 {
    left: 6%;
    top: -38%;
    width: 22px;
    height: 22px;
    background: hsl(120 80% 50%);
    border-radius: 40% 60% 65% 35% / 55% 45% 55% 45%;
    animation-delay: -1.6s;
  }
  .blob.b4 {
    left: 40%;
    top: 8%;
    width: 32px;
    height: 30px;
    background: hsl(190 90% 52%);
    border-radius: 65% 35% 50% 50% / 35% 65% 35% 65%;
    animation-delay: -2.4s;
  }
  .blob.b5 {
    left: 30%;
    top: -32%;
    width: 24px;
    height: 26px;
    background: hsl(280 85% 60%);
    border-radius: 30% 70% 45% 55% / 65% 40% 60% 35%;
    animation-delay: -3.2s;
  }
  .blob.b6 {
    left: 58%;
    top: 35%;
    width: 26px;
    height: 24px;
    background: hsl(320 90% 58%);
    border-radius: 55% 45% 60% 40% / 40% 60% 45% 55%;
    animation-delay: -4s;
  }
  .blob.b7 {
    left: 66%;
    top: -28%;
    width: 28px;
    height: 30px;
    background: hsl(220 90% 60%);
    border-radius: 35% 65% 55% 45% / 60% 35% 65% 40%;
    animation-delay: -4.8s;
  }
  .blob.b8 {
    left: 82%;
    top: 18%;
    width: 30px;
    height: 26px;
    background: hsl(80 80% 52%);
    border-radius: 60% 40% 35% 65% / 50% 60% 40% 50%;
    animation-delay: -5.6s;
  }
  .blob.b9 {
    left: 88%;
    top: -22%;
    width: 22px;
    height: 24px;
    background: hsl(350 90% 60%);
    border-radius: 45% 55% 65% 35% / 55% 45% 50% 50%;
    animation-delay: -6.4s;
  }

  // cycle each blob through the FULL colour wheel (every colour; no black/white)
  @keyframes hue {
    to {
      filter: blur(1px) hue-rotate(360deg);
    }
  }

  // MOBILE (≤768px): the pill is too wide for a phone (it collides with the
  // top-left "+" and the top-right theme toggle). Make it compact.
  @include r.mobile {
    .toggle {
      gap: 0.1rem;
      padding: 0.25rem 0.35rem;
    }
    .option {
      font-size: 0.8rem;
      padding: 0.25rem 0.55rem;
    }
  }
</style>
