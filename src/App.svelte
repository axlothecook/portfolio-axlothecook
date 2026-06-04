<script lang="ts">
  import { onMount } from 'svelte'
  import { gsap } from 'gsap'
  import Shell from './lib/Shell.svelte'
  import IconSprite from './lib/IconSprite.svelte'
  import WelcomeSlide from './lib/slides/WelcomeSlide.svelte'
  import ProjectsSlide from './lib/slides/ProjectsSlide.svelte'
  import SkillsSlide from './lib/slides/SkillsSlide.svelte'
  import AboutSlide from './lib/slides/AboutSlide.svelte'

  // Slide order (Welcome is the hero, unlabelled). Per the user's ordering:
  // Projects = Top, Skills = Middle, About = Bottom.
  const slides = [
    { component: WelcomeSlide, label: '' },
    { component: ProjectsSlide, label: 'Top' },
    { component: SkillsSlide, label: 'Middle' },
    { component: AboutSlide, label: 'Bottom' },
  ]

  // --- transition tuning ---
  // The text fades OUT first, THEN the next fades IN (sequenced, no overlap).
  // Fade-in is slower than fade-out.
  const FADE_OUT = 0.6
  const FADE_IN = 1.1

  let currentIndex = $state(0)

  // The indicator label is driven by the GSAP timeline (not reactively) so it
  // stays in sync: it swaps at the midpoint of the transition, between the
  // out-fade and the in-fade.
  let displayedLabel = $state(slides[0].label)

  // The slide DOM wrappers (one per slide), filled via bind:this.
  let panels: HTMLElement[] = $state([])
  let indicatorEl: HTMLElement | undefined = $state()
  let animating = false

  // Move to an adjacent slide. Locked while animating so one gesture = one
  // slide change. SEQUENCED: the current text drifts up + fades OUT fully,
  // THEN the next text rises from below + fades IN (no overlap; fade-in slower).
  const SHIFT = 40 // px the text travels vertically

  function go(direction: 1 | -1) {
    if (animating) return
    const next = currentIndex + direction
    if (next < 0 || next >= slides.length) return

    animating = true
    const from = panels[currentIndex]
    const to = panels[next]
    const fromText = from.querySelectorAll('.slide-text')
    const toText = to.querySelectorAll('.slide-text')

    // keep the incoming panel hidden until the out-fade has finished
    gsap.set(to, { autoAlpha: 0, zIndex: 0 })
    gsap.set(toText, { y: SHIFT, autoAlpha: 0 })

    const tl = gsap.timeline({
      onComplete() {
        animating = false
      },
    })

    // 1) outgoing: slide text + indicator fade out together (same phase)
    tl.to(fromText, {
      y: -SHIFT,
      autoAlpha: 0,
      duration: FADE_OUT,
      ease: 'power2.in',
    })
    if (indicatorEl) {
      tl.to(indicatorEl, { autoAlpha: 0, duration: FADE_OUT, ease: 'power2.in' }, '<')
    }
    tl.set(from, { autoAlpha: 0, zIndex: 0 })

    // midpoint: swap the indicator label while it's invisible
    tl.call(() => {
      displayedLabel = slides[next].label
    })

    // 2) incoming: slide text + indicator fade in together (same phase)
    tl.set(to, { autoAlpha: 1, zIndex: 1 })
    tl.to(toText, {
      y: 0,
      autoAlpha: 1,
      duration: FADE_IN,
      ease: 'power2.out',
    })
    if (indicatorEl) {
      tl.to(indicatorEl, { autoAlpha: 1, duration: FADE_IN, ease: 'power2.out' }, '<')
    }

    currentIndex = next
  }

  function onWheel(e: WheelEvent) {
    e.preventDefault()
    if (Math.abs(e.deltaY) < 10) return
    go(e.deltaY > 0 ? 1 : -1)
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') go(1)
    if (e.key === 'ArrowUp' || e.key === 'PageUp') go(-1)
  }

  // Touch (phone): swipe up = next, swipe down = previous.
  let touchStartY = 0
  function onTouchStart(e: TouchEvent) {
    touchStartY = e.touches[0].clientY
  }
  function onTouchEnd(e: TouchEvent) {
    const dy = touchStartY - e.changedTouches[0].clientY
    if (Math.abs(dy) > 40) go(dy > 0 ? 1 : -1)
  }

  onMount(() => {
    // Initial state: only the first slide visible.
    panels.forEach((p, i) => {
      gsap.set(p, { autoAlpha: i === 0 ? 1 : 0, zIndex: i === 0 ? 1 : 0 })
    })
  })
</script>

<svelte:window on:keydown={onKey} />

<IconSprite />

<Shell indicator={displayedLabel} bind:indicatorEl>
  <div
    class="deck"
    role="region"
    aria-label="Portfolio slides"
    onwheel={onWheel}
    ontouchstart={onTouchStart}
    ontouchend={onTouchEnd}
  >
    {#each slides as slide, i}
      <div class="panel" bind:this={panels[i]}>
        <slide.component />
      </div>
    {/each}
  </div>
</Shell>

<style lang="scss">
  // All slides stacked in the same place; GSAP fades between them.
  .deck {
    position: relative;
    height: 100vh;
    overflow: hidden;
  }

  .panel {
    position: absolute;
    inset: 0;
  }
</style>
