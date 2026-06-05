<script lang="ts">
  import { onMount } from 'svelte'
  import { gsap } from 'gsap'
  import Shell from './lib/Shell.svelte'
  import IconSprite from './lib/IconSprite.svelte'
  import Character from './lib/Character.svelte'
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
  let dividerEl: HTMLElement | undefined = $state() // ball that melts into the line
  let furnitureEl: HTMLElement | undefined = $state() // shell furniture (fades in)
  let characterEl: HTMLElement | undefined = $state() // the wizard who jumps out
  let sticksEl: HTMLElement | undefined = $state() // bottom-right sticks (drop in)
  let topBarEl: HTMLElement | undefined = $state() // top-centre pill (dragged in)
  let projectileEl: HTMLElement | undefined = $state() // first ball (knocks sticks down)
  let splitBalls: HTMLElement[] = $state([]) // 3 balls the wizard shoots at the sticks

  // Welcome-leads (true) plays "Welcome" then the tagline; false = all at once.
  // We try both to compare.
  const WELCOME_LEADS = true
  let animating = false
  // Locked during the page-load animation: no scrolling / slide changes until
  // the whole front page is visible.
  let loadLocked = true

  // Move to an adjacent slide. Locked while animating so one gesture = one
  // slide change. SEQUENCED: the current text drifts up + fades OUT fully,
  // THEN the next text rises from below + fades IN (no overlap; fade-in slower).
  const SHIFT = 40 // px the text travels vertically

  function go(direction: 1 | -1) {
    if (animating || loadLocked) return
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
    if (loadLocked) {
      e.preventDefault() // no scrolling until the front page is fully shown
      return
    }
    if (Math.abs(e.deltaY) < 10) return
    const dir = e.deltaY > 0 ? 1 : -1

    // If the wheel is over a scrollable content area that can still scroll in
    // this direction, let it scroll the list instead of changing slides.
    const scroller = (e.target as HTMLElement)?.closest?.('.content.scrollable') as
      | HTMLElement
      | null
    if (scroller) {
      const atTop = scroller.scrollTop <= 0
      const atBottom =
        scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1
      const canScroll = dir > 0 ? !atBottom : !atTop
      if (canScroll) return // let the browser scroll the content natively
    }

    // Otherwise change slides.
    e.preventDefault()
    go(dir)
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
    // Only the first (Welcome) slide is visible.
    panels.forEach((p, i) => {
      gsap.set(p, { autoAlpha: i === 0 ? 1 : 0, zIndex: i === 0 ? 1 : 0 })
    })
    playLoadAnimation()
  })

  // Perpetual gravity-bounce on a stick's dot (the earlier design): launch up,
  // decelerate to an apex, fast accelerating fall, repeat. Each dot is staggered
  // by index so they reach the top at different times; the fall is the same.
  function startDotBounce(dot: HTMLElement, index: number) {
    const delay = [0, 0.5, 0.9][index] ?? 0
    gsap.to(dot, {
      keyframes: {
        '0%': { y: 0 },
        '62%': { y: -46, ease: 'sine.out' }, // rise, decelerating
        '100%': { y: 0, ease: 'sine.in' }, // fast accelerating fall
      },
      duration: 1.4,
      delay,
      repeat: -1,
      ease: 'none',
    })
  }

  // The page-load sequence:
  //   1. a dot drops from off-screen top to the divider centre
  //   2. one bounce (up, then back down)
  //   3. on landing it grows up + down into the divider line (scaleY)
  //   4. "Welcome" slides LEFT out from behind the divider (no fade, masked)
  //   5. the tagline slides RIGHT out from behind the divider (no fade, masked)
  //   + the shell furniture fades in
  function playLoadAnimation() {
    const welcome = panels[0]
    const grid = welcome?.querySelector('.grid') as HTMLElement | null
    const title = welcome?.querySelector('.title') as HTMLElement | null
    const tagline = welcome?.querySelector('.tagline') as HTMLElement | null
    if (!dividerEl || !grid || !title || !tagline) return

    // Turn on the divider-edge masks so the text is hidden behind the line.
    grid.classList.add('loading')

    const dropFrom = -(window.innerHeight / 2 + 100) // off-screen above centre
    const BALL = 14 // ball diameter (px)
    const LINE_W = 4 // final line width (px)
    const lineH = dividerEl.offsetHeight || 288

    // --- initial states ---
    // The divider element starts as a round BALL up off-screen (same element
    // will melt into the line). Furniture + text hidden.
    gsap.set(dividerEl, { width: BALL, height: BALL, y: dropFrom })
    if (furnitureEl) gsap.set(furnitureEl, { autoAlpha: 0 })
    gsap.set(title, { x: title.offsetWidth + 40 }) // tucked behind divider (right)
    gsap.set(tagline, { x: -(tagline.offsetWidth + 40) }) // tucked behind (left)

    // bottom-right sticks hidden until the wizard shoots
    if (sticksEl) gsap.set(sticksEl, { autoAlpha: 0 })
    // the top pill starts OFF-SCREEN above; the wizard drags it into place
    if (topBarEl) gsap.set(topBarEl, { y: -160 })

    // character starts hidden behind the line at FLOOR level (no wand yet).
    const charH0 = characterEl?.offsetHeight || 112
    const FLOOR_Y = lineH / 2 - charH0 / 2 // feet at the line's bottom edge
    const headGroup = characterEl?.querySelector('.ch-headgroup') as SVGElement | null
    const rightArm = characterEl?.querySelector('.ch-rightarm') as SVGElement | null
    const wand = characterEl?.querySelector('.ch-wand') as SVGGElement | null
    if (wand) gsap.set(wand, { autoAlpha: 0 })
    if (characterEl) {
      gsap.set(characterEl, {
        // left-align to the anchor (line centre) so the character stays to the
        // RIGHT of the line and never peeks out the left side.
        xPercent: 0,
        yPercent: -50,
        x: 0,
        y: FLOOR_Y, // standing on the floor, behind the line
        autoAlpha: 0,
        transformOrigin: '50% 100%',
      })
    }

    const tl = gsap.timeline({
      onComplete() {
        grid.classList.remove('loading') // masks no longer needed
        loadLocked = false // the front page is fully visible — allow scrolling
      },
    })

    // 1) the ball drops from off-screen top to the centre
    tl.to(dividerEl, { y: 0, duration: 0.8, ease: 'power2.in' })
    // 2) one bounce: up (higher), then a quick accelerating fall back to centre
    tl.to(dividerEl, { y: -160, duration: 0.55, ease: 'power2.out' })
    tl.to(dividerEl, { y: 0, duration: 0.45, ease: 'power2.in' })
    // 3) IMPACT squash: on landing the ball flattens a touch (wider + shorter)…
    tl.to(dividerEl, { width: BALL + 6, height: BALL - 5, duration: 0.12, ease: 'power2.out' })
    // 4) …then its OWN body stretches vertically into the line (height to full,
    //    width to the line width) — the ball melts into the line, one element.
    tl.to(dividerEl, { width: LINE_W, height: lineH, duration: 0.7, ease: 'power3.inOut' })

    // 5) ONLY AFTER the line forms: the shell decorations fade in
    if (furnitureEl) tl.to(furnitureEl, { autoAlpha: 1, duration: 0.7 })

    // 6) the wizard WALKS OUT from behind the line to a spot to the right, on the
    //    floor. His legs alternate-swing (a walk cycle) and the body bobs subtly.
    if (characterEl) {
      const STAND_X = 150 // distance walked to the right of the line
      const WALK_DUR = 1.4
      const STEPS = 5 // number of leg swings during the walk

      tl.to(characterEl, { autoAlpha: 1, duration: 0.2 }, '+=0.1')
      // body travels right
      tl.to(characterEl, { x: STAND_X, duration: WALK_DUR, ease: 'none' }, '<')
      // subtle up/down body bob in time with the steps
      tl.to(
        characterEl,
        { y: `-=6`, duration: WALK_DUR / (STEPS * 2), ease: 'sine.inOut', yoyo: true, repeat: STEPS * 2 - 1 },
        '<',
      )
      // (legs are static — part of the body, no leg animation during the walk)

      // 6b) after stopping, he LOOKS BACK: the head flips across its vertical
      //     axis (mirror, scaleX -1) and back. Using svgOrigin (viewBox coords =
      //     head centre) makes it flip exactly in place — no drift off the body.
      if (headGroup) {
        tl.to(headGroup, { scaleX: -1, svgOrigin: '50 26', duration: 0.5, ease: 'power2.inOut' }, '+=0.2')
        tl.to(headGroup, { scaleX: 1, svgOrigin: '50 26', duration: 0.5, ease: 'power2.inOut' }, '+=0.3')
      }

      // 6c) PULL OUT THE WAND + POINT UP: the right arm raises about the shoulder
      //     (svgOrigin at 54,46) so the hand swings up; the wand fades in as it's
      //     drawn, ending pointing upward.
      if (rightArm && wand) {
        tl.to(wand, { autoAlpha: 1, duration: 0.2 }, '+=0.2')
        // -100° points the arm + wand toward the page's top-right corner
        tl.to(rightArm, { rotation: -100, svgOrigin: '54 46', duration: 0.6, ease: 'back.out(1.6)' }, '<')
      }

      // 6d) SHOOT: a small ball fires fast from the wand tip to the TOP-RIGHT
      //     CORNER of the page, then (0.8s later) the sticks DROP IN.
      if (projectileEl) {
        // place the ball at the wand tip, then fire it to the top-right corner
        tl.add(() => {
          const tip = characterEl?.querySelector('.ch-wand path') as SVGElement | null
          const r = tip?.getBoundingClientRect()
          if (r) {
            const startX = r.left + r.width / 2 - 5
            const startY = r.top + r.height / 2 - 5
            gsap.set(projectileEl!, { x: startX, y: startY, opacity: 1 })
            // target = a bit LEFT of the page's top-right corner; constant speed
            const targetX = window.innerWidth - 120
            gsap.to(projectileEl!, {
              x: `+=${targetX - startX}`,
              y: `+=${0 - startY}`,
              duration: 0.6,
              ease: 'none',
              onComplete() {
                gsap.set(projectileEl!, { opacity: 0 })
              },
            })
          }
        }, '+=0.1')
        // hold while the ball flies
        tl.to({}, { duration: 0.6 })
      }

      // 6e) the 3 sticks drop in from above, staggered + wobble to settle
      if (sticksEl) {
        const sticks = Array.from(sticksEl.querySelectorAll('.stick')) as HTMLElement[]
        // order: middle (1), then left (0), then right (2)
        const order = [sticks[1], sticks[0], sticks[2]].filter(Boolean)
        gsap.set(sticksEl, { autoAlpha: 1 })
        order.forEach((stick, i) => {
          gsap.set(stick, { y: -window.innerHeight, transformOrigin: '50% 100%' })
          // 0.8s after the shot before the first (middle) stick falls
          tl.to(stick, { y: 0, duration: 0.45, ease: 'power2.in' }, i === 0 ? '+=0.8' : '-=0.32')
          // wobble left/right on landing
          tl.to(stick, { rotation: 5, duration: 0.1, ease: 'sine.inOut', yoyo: true, repeat: 3, transformOrigin: '50% 100%' }, '-=0.05')
          tl.to(stick, { rotation: 0, duration: 0.12, ease: 'sine.out', transformOrigin: '50% 100%' })
        })
      }

      // 6f) AIM at the sticks: lower the wand back toward its resting angle so it
      //     points DOWN-RIGHT (south-east) at the bottom-right sticks.
      if (rightArm) {
        tl.to(rightArm, { rotation: -32, svgOrigin: '54 46', duration: 0.4, ease: 'power2.inOut' }, '+=0.2')
      }

      // 6g) SECOND SHOT: the wizard shoots 3 balls from the wand; each flies onto
      //     a stick top and becomes its dot, which then bounces (staggered).
      if (sticksEl && splitBalls.length === 3) {
        const dots = Array.from(sticksEl.querySelectorAll('.dot')) as HTMLElement[]

        tl.add(() => {
          const tip = characterEl?.querySelector('.ch-wand path') as SVGElement | null
          const tr = tip?.getBoundingClientRect()
          dots.forEach((dot, i) => {
            const dr = dot.getBoundingClientRect()
            const ball = splitBalls[i]
            // each ball EMERGES from the wand tip: starts at the tip scaled to 0,
            // then pops to full size as it shoots out toward its stick dot.
            if (tr) gsap.set(ball, { x: tr.left + tr.width / 2 - 5.5, y: tr.top + tr.height / 2 - 5.5, opacity: 1, scale: 0 })
            gsap.to(ball, { scale: 1, duration: 0.18, delay: i * 0.5, ease: 'back.out(2)' })
            gsap.to(ball, {
              x: dr.left + dr.width / 2 - 5.5,
              y: dr.top + dr.height / 2 - 5.5,
              duration: 0.5,
              delay: i * 0.5, // ~0.5s between each ball
              ease: 'power2.out',
              onComplete() {
                gsap.set(ball, { opacity: 0 })
                gsap.set(dot, { opacity: 1 })
                startDotBounce(dot, i)
              },
            })
          })
        }, '+=0.3')
        // hold the timeline while all 3 balls fire (0.5s apart) + land
        tl.to({}, { duration: 1.7 })
      }

      // 6h) DRAG IN THE TOP BAR. Beats: put the (right-hand) wand away → look
      //     left → pause → the wand appears in the LEFT hand and that hand goes
      //     UP → magically pull the top pill DOWN from off-screen into place.
      const leftArm = characterEl?.querySelector('.ch-leftarm') as SVGElement | null
      const wandLeft = characterEl?.querySelector('.ch-wand-left') as SVGElement | null
      if (leftArm && wandLeft && headGroup && topBarEl) {
        // 1) put the wand away: lower the right arm to rest + hide the wand
        if (rightArm) tl.to(rightArm, { rotation: 0, svgOrigin: '54 46', duration: 0.35, ease: 'power2.inOut' }, '+=0.3')
        if (wand) tl.set(wand, { autoAlpha: 0 })
        // 2) look left
        tl.to(headGroup, { scaleX: -1, svgOrigin: '50 26', duration: 0.4, ease: 'power2.inOut' }, '+=0.15')
        // 3) pause
        tl.to({}, { duration: 0.5 })
        // 4) the wand appears in the LEFT hand and the hand goes UP on the LEFT
        //    side of the body (~15° left of straight up)
        tl.set(wandLeft, { autoAlpha: 1 })
        tl.to(leftArm, { rotation: 125, svgOrigin: '46 46', duration: 0.5, ease: 'power2.out' })
        // 5) the pill drags down into place (magic pull), with a soft settle
        tl.to(topBarEl, { y: 0, duration: 0.8, ease: 'back.out(1.4)' }, '-=0.05')
      }
    }

    // 7) Welcome slides left out from behind the divider (no fade), slower
    tl.to(title, { x: 0, duration: 1.0, ease: 'power3.out' })

    // 6) tagline slides right out from behind the divider, 0.7s AFTER Welcome
    const taglineStart = WELCOME_LEADS ? '+=0.7' : '<'
    tl.to(tagline, { x: 0, duration: 1.0, ease: 'power3.out' }, taglineStart)
  }
</script>

<svelte:window on:keydown={onKey} />

<IconSprite />

<!-- The character is anchored at screen centre (where the divider line is); it
     jumps out to the right of the line during the load animation. -->
<div class="character-anchor" bind:this={characterEl}><Character /></div>

<!-- the first small ball the wizard shoots (knocks the sticks down) -->
<div class="projectile" bind:this={projectileEl}></div>

<!-- 3 balls the wizard shoots; each flies to a stick top and becomes its dot -->
{#each [0, 1, 2] as i}
  <div class="split-ball" bind:this={splitBalls[i]}></div>
{/each}

<Shell indicator={displayedLabel} bind:indicatorEl bind:dividerEl bind:furnitureEl bind:sticksEl bind:topBarEl>
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
  // The character is anchored at the centre of the screen (the divider line).
  // GSAP positions/animates it from there (it stands just right of the line).
  .character-anchor {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 2; // above the divider line
  }

  // First small ball shot from the wand (knocks the sticks down).
  .projectile {
    position: fixed;
    top: 0;
    left: 0;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--color-ink);
    opacity: 0;
    z-index: 3;
  }

  // The 3 balls the wizard shoots at the sticks (each becomes a stick's dot).
  .split-ball {
    position: fixed;
    top: 0;
    left: 0;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background-color: var(--color-ink);
    opacity: 0;
    z-index: 3;
  }

  // TEMPORARY: hide the front-page Welcome text while we work on the character.
  // (Elements stay in the DOM so the load animation refs still resolve.)
  :global(.panel:first-child .title),
  :global(.panel:first-child .tagline) {
    visibility: hidden;
  }

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
