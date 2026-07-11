<script lang="ts">
  import { onMount } from 'svelte'
  import { gsap } from 'gsap'
  import Shell from './lib/Shell.svelte'
  import IconSprite from './lib/IconSprite.svelte'
  import Character from './lib/Character.svelte'
  import AnimatedScreen from './lib/AnimatedScreen.svelte'
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
  // Fade-in is slower than fade-out. (Sped up slightly for snappier slide changes.)
  const FADE_OUT = 0.45
  const FADE_IN = 0.8

  let currentIndex = $state(0)

  // Display mode: the top-bar toggle switches between the normal portfolio
  // ("straightforward") and the "animated" placeholder screen. Lifted here so it
  // can hide/show the whole page. The toggle (top bar) stays visible in both.
  type Mode = 'straightforward' | 'animated'
  let mode = $state<Mode>('straightforward')

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
  let characterClipEl: HTMLElement | undefined = $state() // clip box (emerge from line)
  let sticksEl: HTMLElement | undefined = $state() // bottom-right sticks (drop in)
  let topBarEl: HTMLElement | undefined = $state() // top-centre pill (dragged in)
  let leftBarEl: HTMLElement | undefined = $state() // far-left wall (dragged in)
  let rocksEl: HTMLElement | undefined = $state() // layer for rock chips off the wall
  let plusEl: SVGElement | undefined = $state() // top-left "+" (assembled from balls, spins)
  let topDotsEl: HTMLElement | undefined = $state() // 3 dots under "+" (assembled from rubble)
  let bottomDotsEl: HTMLElement | undefined = $state() // bottom-left 3 dots (Newton's cradle)
  let projectileEl: HTMLElement | undefined = $state() // first ball (knocks sticks down)
  let splitBalls: HTMLElement[] = $state([]) // 3 balls the wizard shoots at the sticks
  let mobileDotEl: HTMLElement | undefined = $state() // mobile intro dot (forms the line)

  // Welcome-leads (true) plays "Welcome" then the tagline; false = all at once.
  // We try both to compare.
  const WELCOME_LEADS = true
  let animating = false
  // Locked during the page-load animation: no scrolling / slide changes — and the
  // Animated-mode toggle is disabled — until the whole front page is visible.
  // ($state so the toggle's disabled state updates when the load completes.)
  let loadLocked = $state(true)

  // The desktop load timeline, captured so the Skip button can fast-forward it.
  // `showSkip` drives the button: shown only while the DESKTOP wizard load is
  // running (never on mobile — the wizard doesn't play there). Skipping seeks the
  // timeline to its end, which lands every element at its final position and fires
  // all the perpetual-motion starters, then runs the timeline's own onComplete.
  let loadTl: gsap.core.Timeline | undefined
  let showSkip = $state(false)

  // SKIP: abandon the wizard show entirely. Every element SNAPS to its final
  // resting state with NO animation — the only thing still played is the closing
  // beat: Welcome + the tagline sliding out from behind the line. The perpetual
  // idle motions (the "+" spin, stick-dot bounces, the Newton's cradle) start
  // immediately, same as after the full animation.
  function skipLoad() {
    if (!loadTl) return
    showSkip = false

    // the load runs at a raised global timeScale — back to normal speed first so
    // the slide-out below and the idle loops play at 1×.
    gsap.globalTimeline.timeScale(1)

    // 1) stop EVERYTHING the load has started: the master timeline plus every
    //    independent tween its callbacks spawned (rock chips, ball flights, …).
    loadTl.kill()
    loadTl = undefined
    gsap.globalTimeline.getChildren(true, true, true).forEach((t) => t.kill())

    // 2) throw away the wizard + his loose props (rocks, balls). The static shell
    //    marks below replace the rock-formed ones (they're identical ink dots).
    if (characterEl) gsap.set(characterEl, { autoAlpha: 0 })
    if (rocksEl) rocksEl.replaceChildren()
    if (projectileEl) gsap.set(projectileEl, { opacity: 0 })
    splitBalls.forEach((b) => b && gsap.set(b, { opacity: 0 }))

    // 3) SNAP the shell to its final state: clearing the inline (GSAP) styles
    //    returns every piece to its plain-CSS resting layout — the line divider,
    //    seated top pill, left wall in place, furniture visible, sticks standing.
    const toClear = [dividerEl, furnitureEl, topBarEl, leftBarEl, sticksEl, plusEl, topDotsEl, bottomDotsEl]
    toClear.forEach((el) => el && gsap.set(el, { clearProps: 'all' }))
    if (sticksEl) {
      const sticks = Array.from(sticksEl.querySelectorAll('.stick')) as HTMLElement[]
      // clear ONLY the transforms — clearProps:'all' would wipe the whole inline
      // style, including the markup-authored `--stick-height` var the line heights
      // are built on (which collapsed the stick lines to zero).
      sticks.forEach((s) => gsap.set(s, { clearProps: 'transform' }))
      // the dots are CSS-hidden until the wizard lands balls on them — show them.
      const dots = Array.from(sticksEl.querySelectorAll('.dot')) as HTMLElement[]
      dots.forEach((d) => gsap.set(d, { opacity: 1, y: 0 }))
    }

    // 4) start the perpetual idle motions from rest (the same routine the mobile
    //    load uses: "+" spin, staggered stick-dot bounces, Newton's cradle).
    startMobileFurnitureMotion()

    // 5) the ONLY animation kept: Welcome + tagline slide out from behind the
    //    line (masked, no fade) — then the page unlocks.
    const welcome = panels[0]
    const grid = welcome?.querySelector('.grid') as HTMLElement | null
    const title = welcome?.querySelector('.title') as HTMLElement | null
    const tagline = welcome?.querySelector('.tagline') as HTMLElement | null
    if (!grid || !title || !tagline) {
      loadLocked = false
      return
    }
    grid.classList.add('loading') // divider-edge masks for the slide-out
    gsap.set(title, { x: title.offsetWidth + 40 }) // tucked behind the line (right)
    gsap.set(tagline, { x: -(tagline.offsetWidth + 40) }) // tucked behind (left)
    gsap
      .timeline({
        onComplete() {
          grid.classList.remove('loading')
          loadLocked = false
        },
      })
      .to(title, { x: 0, duration: 1.0, ease: 'power3.out' })
      .to(tagline, { x: 0, duration: 1.0, ease: 'power3.out' }, '<+=0.57')
  }

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

    // On MOBILE slides change horizontally (text moves on X); on desktop it's the
    // vertical Y motion. The motion DIRECTION follows the navigation direction so
    // the user can tell which way they're going: going FORWARD (next, dir=1) the
    // outgoing exits in the negative direction and the incoming enters from the
    // positive side; going BACKWARD (prev, dir=-1) both flip. (Forward = exits
    // left / enters from right; backward = exits right / enters from left.)
    const axis: 'x' | 'y' = isMobile() ? 'x' : 'y'
    const outVars: gsap.TweenVars = { autoAlpha: 0, duration: FADE_OUT, ease: 'power2.in' }
    const inFrom: gsap.TweenVars = { autoAlpha: 0 }
    const inTo: gsap.TweenVars = { autoAlpha: 1, duration: FADE_IN, ease: 'power2.out' }
    outVars[axis] = -SHIFT * direction
    inFrom[axis] = SHIFT * direction
    inTo[axis] = 0

    // keep the incoming panel hidden until the out-fade has finished
    gsap.set(to, { autoAlpha: 0, zIndex: 0 })
    gsap.set(toText, inFrom)

    const tl = gsap.timeline({
      onComplete() {
        animating = false
      },
    })

    // 1) outgoing: slide text + indicator fade out together (same phase)
    tl.to(fromText, outVars)
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
    tl.to(toText, inTo)
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

  // Touch (phone): slides change on a HORIZONTAL swipe — swipe LEFT = next,
  // swipe RIGHT = previous. We act ONLY on a dominantly-horizontal gesture, so
  // VERTICAL scrolling is left entirely to the browser (the content divs scroll
  // up/down natively). This is what avoids hijacking the page scroll — fixing the
  // scroll-up-reloads / page-extends bugs that the up/down handler caused.
  let touchStartX = 0
  let touchStartY = 0
  function onTouchStart(e: TouchEvent) {
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
  }
  function onTouchEnd(e: TouchEvent) {
    if (loadLocked) return
    const dx = touchStartX - e.changedTouches[0].clientX
    const dy = touchStartY - e.changedTouches[0].clientY
    // only a dominantly-horizontal swipe past the threshold changes a slide
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      go(dx > 0 ? 1 : -1) // content moves left → next slide
    }
  }

  // mobile = the same ≤768px breakpoint the CSS uses. On mobile the layout is
  // stacked around a HORIZONTAL divider and the wizard intro is replaced by a
  // simple dot-splash + line-grow + fade-in (see playMobileLoad).
  const isMobile = () =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

  onMount(() => {
    // Only the first (Welcome) slide is visible.
    panels.forEach((p, i) => {
      gsap.set(p, { autoAlpha: i === 0 ? 1 : 0, zIndex: i === 0 ? 1 : 0 })
    })
    if (isMobile()) playMobileLoad()
    else playLoadAnimation()
  })

  // Perpetual gravity-bounce on a stick's dot (the earlier design): launch up,
  // decelerate to an apex, fast accelerating fall, repeat. Each dot is staggered
  // by index so they reach the top at different times; the fall is the same.
  // The top-left "+" (a cross of 5 balls) spins forever once assembled. Each ball
  // rotates about the cross's SHARED centre (a per-ball transformOrigin in px
  // pointing back to centre) so the cross stays rigid as it turns. Each turn is
  // SNAPPY: it spins up fast and slows down fast (power3.inOut over ~0.4s), then
  // a short rest before the next turn — a quick pulse, not a slow constant spin.
  function startPlusSpin(balls: HTMLElement[], slots: number[][], ballCentre: number) {
    balls.forEach((ball, i) => {
      const [ox, oy] = slots[i]
      // the shared cross-centre, expressed relative to THIS ball's own box:
      // ball centre is at (ballCentre, ballCentre); the cross centre is offset
      // back by this ball's arm offset (ox, oy).
      gsap.set(ball, { transformOrigin: `${ballCentre - ox}px ${ballCentre - oy}px` })
      gsap.to(ball, {
        rotation: '+=360',
        duration: 0.8, // fast spin-up + fast slow-down
        ease: 'power3.inOut',
        repeat: -1,
        repeatDelay: 0.5, // brief rest between turns
      })
    })
  }

  // peak height of the top cradle ball above its rest (shared so the pre-lift in
  // the timeline and the loop below use the exact same value → no jump).
  const NEWTON_TOP_LIFT = 40
  // Newton's-cradle-style perpetual loop for the bottom-left dot stack.
  // `balls` is the vertical chain top → bottom (4 of them). The impulse passes
  // DOWN the chain (top drops, each relay nudges the next), the BOTTOM ball dips
  // to a lowest point and returns, then the impulse passes back UP to the top,
  // which rises to its peak and drops again — looping forever.
  function startNewtonsCradle(balls: HTMLElement[], restPositions?: number[]) {
    const TOP_LIFT = NEWTON_TOP_LIFT // peak height of the top ball above rest
    const DIP = 34 // how far the bottom ball dips below rest (bigger dip)
    const NUDGE = 8 // small travel a relay (middle) ball makes to pass the impulse
    // each ball animates RELATIVE to its resting dot position. Use the explicitly
    // captured rests if given (the top ball may be pre-lifted at call time, so its
    // CURRENT y is NOT its rest); otherwise fall back to the current y.
    const rest = balls.map((b, i) => restPositions?.[i] ?? ((gsap.getProperty(b, 'y') as number) || 0))
    const top = balls[0]
    const bottom = balls[balls.length - 1]
    const relays = balls.slice(1, -1) // the inner balls that just pass it through
    const tl = gsap.timeline({ repeat: -1 })

    // 1) top ball DROPS from its peak onto the chain (fast gravity fall)
    tl.set(top, { y: rest[0] - TOP_LIFT })
    tl.to(top, { y: rest[0], duration: 0.32, ease: 'power2.in' }) // accelerating fall → impact
    // 2) impulse passes DOWN through each relay ball (each dips a touch then settles)
    relays.forEach((b, k) => {
      const idx = k + 1
      tl.to(b, { y: rest[idx] + NUDGE, duration: 0.07, ease: 'power2.in' })
      tl.to(b, { y: rest[idx], duration: 0.1, ease: 'power2.out' }, '>-=0.02')
    })
    // 3) the BOTTOM ball takes the energy and DIPS DOWN to its lowest point, then
    //    returns up (decelerate down, accelerate back up)
    tl.to(bottom, { y: rest[balls.length - 1] + DIP, duration: 0.24, ease: 'power2.out' })
    tl.to(bottom, { y: rest[balls.length - 1], duration: 0.24, ease: 'power2.in' })
    // 4) impulse passes back UP through each relay (reverse order, nudging up)
    ;[...relays].reverse().forEach((b) => {
      const idx = balls.indexOf(b)
      tl.to(b, { y: rest[idx] - NUDGE, duration: 0.07, ease: 'power2.in' })
      tl.to(b, { y: rest[idx], duration: 0.1, ease: 'power2.out' }, '>-=0.02')
    })
    // 5) the top ball rises back to its peak (decelerating, like a real toss up),
    //    momentarily stops — then the loop drops it again
    tl.to(top, { y: rest[0] - TOP_LIFT, duration: 0.3, ease: 'power2.out' })

    return tl
  }

  function startDotBounce(dot: HTMLElement) {
    // Each dot starts bouncing the INSTANT its ball lands — no extra delay. The
    // dots stay nicely out of phase because the balls arrive ~0.5s apart (the
    // firing stagger), so their bounce cycles are naturally offset.
    //
    // True constant-gravity bounce: it leaves the stick surface FAST (max speed),
    // DECELERATES on the way up and nearly stops at the peak, then ACCELERATES on
    // the way down — symmetric halves (rise time = fall time), quadratic easing.
    gsap.to(dot, {
      keyframes: {
        '0%': { y: 0 },
        '50%': { y: -46, ease: 'power2.out' }, // rise: fast off the surface → slows to a stop at the peak
        '100%': { y: 0, ease: 'power2.in' }, // fall: accelerates back down to the surface
      },
      duration: 1.2,
      repeat: -1,
      ease: 'none',
    })
  }

  // MOBILE load intro (≤768px): NO wizard, and the divider is HIDDEN (each slide
  // draws its own horizontal separator). Mirrors the DESKTOP dot-into-line beat,
  // but the line forms HORIZONTALLY:
  //   1. the separator starts as a round DOT above its slot; it drops in + bounces
  //   2. a splash squash, then it stretches SIDEWAYS into the full-width line
  //   3. the shell furniture + bottom-right sticks fade into place
  //   4. "Welcome" drops in from above the line; the tagline rises from below
  //   5. the perpetual furniture motions start (spin / bounce / bob)
  function playMobileLoad() {
    const welcome = panels[0]
    const title = welcome?.querySelector('.title') as HTMLElement | null
    const tagline = welcome?.querySelector('.tagline') as HTMLElement | null
    const line = welcome?.querySelector('.spacer') as HTMLElement | null
    const dot = mobileDotEl

    const DOT = 12 // dot diameter (px)

    // the FINAL line geometry + POSITION (so the dot grows to exactly match — and
    // lands exactly ON — the real .spacer in the Welcome grid). The dot is anchored
    // at top:50% (viewport centre); restY shifts it onto the line's real centre so
    // the hand-off doesn't jump (the grid line isn't exactly at viewport centre).
    const lineRect = line?.getBoundingClientRect()
    const lineW = line?.offsetWidth || window.innerWidth - 48
    const restY = lineRect ? lineRect.top + lineRect.height / 2 - window.innerHeight / 2 : 0
    const dropFrom = restY - (window.innerHeight / 2 + 60) // off-screen above the rest spot

    // initial states: furniture/sticks/text hidden. The real per-slide line stays
    // hidden until the dot finishes forming, then we reveal it + remove the dot —
    // so every slide's line ends up identical (plain CSS), no residual styles.
    if (furnitureEl) gsap.set(furnitureEl, { autoAlpha: 0 })
    if (sticksEl) gsap.set(sticksEl, { autoAlpha: 0 }) // bottom-right fades in too
    if (line) gsap.set(line, { autoAlpha: 0 })
    if (title) gsap.set(title, { y: -24, autoAlpha: 0 })
    if (tagline) gsap.set(tagline, { y: 24, autoAlpha: 0 })
    // the intro dot starts as a small circle, off-screen above SCREEN CENTRE.
    // xPercent/yPercent:-50 keep it centred on its top/left:50% anchor as it
    // resizes (so growth is symmetric about the centre, not left-anchored).
    if (dot) gsap.set(dot, { xPercent: -50, yPercent: -50, width: DOT, height: DOT, x: 0, y: dropFrom, autoAlpha: 1 })

    const tl = gsap.timeline({
      onComplete() {
        loadLocked = false // front page fully shown — allow swiping
        startMobileFurnitureMotion() // perpetual: spin, bounce, bob
      },
    })

    if (dot) {
      // 1) the dot drops from off-screen onto the LINE'S rest spot (= where the
      //    real .spacer sits, so the later hand-off doesn't jump)
      tl.to(dot, { y: restY, duration: 0.6, ease: 'power2.in' })
      // 2) one small bounce
      tl.to(dot, { y: restY - 44, duration: 0.32, ease: 'power2.out' })
      tl.to(dot, { y: restY, duration: 0.28, ease: 'power2.in' })
      // 3) splash squash, then stretch SIDEWAYS (centred) into the full line width
      tl.to(dot, { width: DOT + 6, height: DOT - 5, duration: 0.1, ease: 'power2.out' })
      tl.to(dot, { width: lineW, height: 4, duration: 0.55, ease: 'power3.inOut' })
      // 4) hand off: reveal the real per-slide line, hide the intro dot. They're at
      //    the SAME position now, so there's no visible jump.
      tl.add(() => {
        if (line) gsap.set(line, { autoAlpha: 1 })
        gsap.set(dot, { autoAlpha: 0 })
      })
    } else if (line) {
      tl.to(line, { autoAlpha: 1, duration: 0.4 })
    }

    // 5) furniture + bottom-right sticks fade in as the line completes
    if (furnitureEl) tl.to(furnitureEl, { autoAlpha: 1, duration: 0.6 }, '>-0.15')
    if (sticksEl) tl.to(sticksEl, { autoAlpha: 1, duration: 0.6 }, '<')
    // 6) title drops in from above the line; tagline rises from below
    tl.addLabel('textIn', '>-0.1')
    if (title) tl.to(title, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out' }, 'textIn')
    if (tagline) tl.to(tagline, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out' }, 'textIn+=0.15')
  }

  // Perpetual decorative motion on MOBILE (no wizard to wire it up). Spins the
  // "+", bounces each bottom-right stick dot, and runs a simple bob on the
  // bottom-left dot stack — so the corners aren't static.
  function startMobileFurnitureMotion() {
    // the "+" spins forever (snappy pulse like desktop)
    if (plusEl) {
      gsap.set(plusEl, { transformOrigin: '50% 50%' })
      gsap.to(plusEl, { rotation: '+=360', duration: 0.8, ease: 'power3.inOut', repeat: -1, repeatDelay: 0.5 })
    }
    // each bottom-right stick dot does the gravity bounce (staggered)
    if (sticksEl) {
      const dots = Array.from(sticksEl.querySelectorAll('.dot')) as HTMLElement[]
      dots.forEach((dot, i) => {
        gsap.delayedCall(i * 0.35, () => startDotBounce(dot))
      })
    }
    // the bottom-left dot stack runs the REAL perpetual Newton's-cradle loop (the
    // same one the desktop wizard sets up): top ball drops, the impulse passes
    // down through the chain, the bottom ball dips + returns, the impulse passes
    // back up, the top ball rises to its peak — forever. Rests are 0 (at-rest).
    if (bottomDotsEl) {
      const dots = Array.from(bottomDotsEl.querySelectorAll('.dot')) as HTMLElement[]
      if (dots.length === 4) {
        const rests = dots.map(() => 0)
        // pre-lift the top ball to its peak so the first drop starts from there
        // (matches startNewtonsCradle's expectation), then start the loop.
        gsap.set(dots[0], { y: -NEWTON_TOP_LIFT })
        startNewtonsCradle(dots, rests)
      }
    }
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
    const LINE_W = 6 // final line width (px) — matches .center-divider width
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
    // the left wall starts OFF-SCREEN to the left; the wizard drags it in later
    if (leftBarEl) gsap.set(leftBarEl, { xPercent: -100 })
    // the "+" mark + both dot-stacks are hidden until ASSEMBLED from balls
    if (plusEl) gsap.set(plusEl, { autoAlpha: 0 })
    if (topDotsEl) gsap.set(topDotsEl, { autoAlpha: 0 })
    if (bottomDotsEl) gsap.set(bottomDotsEl, { autoAlpha: 0 })

    // character starts BEHIND the line at FLOOR level (no wand yet). He's fully
    // to the LEFT of the clip's edge (the line) so the clip hides him; he then
    // walks RIGHT and emerges from the line.
    const charH0 = characterEl?.offsetHeight || 112
    const charW0 = characterEl?.offsetWidth || 80
    const FLOOR_Y = lineH / 2 - charH0 / 2 // feet at the line's bottom edge
    const headGroup = characterEl?.querySelector('.ch-headgroup') as SVGElement | null
    const rightArm = characterEl?.querySelector('.ch-rightarm') as SVGElement | null
    const wand = characterEl?.querySelector('.ch-wand') as SVGGElement | null
    if (wand) gsap.set(wand, { autoAlpha: 0 })
    if (characterClipEl) characterClipEl.classList.add('clipping') // hide behind the line
    if (characterEl) {
      gsap.set(characterEl, {
        // start fully behind the line: shifted LEFT by his own width so the clip
        // (left edge at the line) hides him entirely until he walks out.
        xPercent: 0,
        yPercent: -50,
        x: -charW0,
        y: FLOOR_Y,
        autoAlpha: 1, // visible — the CLIP hides him, not opacity
        transformOrigin: '50% 100%',
      })
    }

    const tl = gsap.timeline({
      onComplete() {
        grid.classList.remove('loading') // masks no longer needed
        loadLocked = false // the front page is fully visible — allow scrolling
        showSkip = false // nothing left to skip
        gsap.globalTimeline.timeScale(1) // load is over — everything back to normal speed
      },
    })
    // expose the timeline to the Skip button + show it now that the load is running.
    loadTl = tl
    showSkip = true

    // SPEED-UP: play the whole load 1.35× faster. Set on the GLOBAL timeline (not
    // this one) because the load spawns many INDEPENDENT tweens from callbacks
    // (rock chips, ball flights, the sticks' drop, delayedCalls) whose real-time
    // durations the master timeline's holds are tuned to — scaling only `tl` would
    // desync them (e.g. the wizard would shoot at sticks that haven't landed yet).
    // Restored to 1 in onComplete and in skipLoad.
    gsap.globalTimeline.timeScale(1.35)

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
    //    floor — he emerges FROM the line (the clip reveals him as he crosses it).
    //    The body bobs subtly with the steps.
    if (characterEl) {
      const STAND_X = 150 // distance walked to the right of the line
      const WALK_DUR = 1.4
      const STEPS = 5 // number of leg swings during the walk

      // body travels right, emerging from behind the line
      tl.to(characterEl, { x: STAND_X, duration: WALK_DUR, ease: 'none' }, '+=0.1')
      // subtle up/down body bob in time with the steps
      tl.to(
        characterEl,
        { y: `-=6`, duration: WALK_DUR / (STEPS * 2), ease: 'sine.inOut', yoyo: true, repeat: STEPS * 2 - 1 },
        '<',
      )
      // (legs are static — part of the body, no leg animation during the walk)
      // he's clear of the line now — drop the clip so the later raised wand/star
      // (which extends above him) isn't cropped by the clip box.
      tl.add(() => characterClipEl?.classList.remove('clipping'))

      // 6b) after stopping, he LOOKS BACK: the head flips across its vertical
      //     axis (mirror, scaleX -1) and back. Using svgOrigin (viewBox coords =
      //     head centre) makes it flip exactly in place — no drift off the body.
      if (headGroup) {
        tl.to(headGroup, { scaleX: -1, svgOrigin: '50 26', duration: 0.5, ease: 'power2.inOut' }, '+=0.1')
        tl.to(headGroup, { scaleX: 1, svgOrigin: '50 26', duration: 0.5, ease: 'power2.inOut' }, '+=0.15')
      }

      // 6c) PULL OUT THE WAND + POINT UP: the right arm raises about the shoulder
      //     (svgOrigin at 54,46) so the hand swings up; the wand fades in as it's
      //     drawn, ending pointing upward.
      if (rightArm && wand) {
        // a short beat after the look-back before drawing the wand
        tl.to(wand, { autoAlpha: 1, duration: 0.2 }, '+=0.3')
        // -100° points the arm + wand toward the page's top-right corner
        tl.to(rightArm, { rotation: -100, svgOrigin: '54 46', duration: 0.6, ease: 'back.out(1.6)' }, '<')
      }

      // 6e-prep) the sticks are FULL LENGTH the whole time, hanging from the top.
      //     While hanging, only a SHORT bottom portion is on-screen — the rest of
      //     each stick extends ABOVE the top edge, hidden off-screen. When struck
      //     they simply FALL DOWN (pure translate) to their standing home, which
      //     reveals their full height. No visible height growth.
      let dropSticks: (() => void) | null = null
      if (sticksEl) {
        const cluster = sticksEl
        const sticks = Array.from(cluster.querySelectorAll('.stick')) as HTMLElement[]
        const fulls = sticks.map((s) => parseFloat(getComputedStyle(s).getPropertyValue('--stick-height')) || 0)
        const SHORT = Math.min(...fulls) // visible hanging length before the fall
        // lines keep their FULL height (set by CSS --stick-height) — no tweening.
        gsap.set(cluster, { y: 0 }) // clear any transform before measuring
        void cluster.offsetHeight // force reflow
        // translate the cluster UP so the sticks' BOTTOMS sit SHORT px below the
        // top edge: visible part = SHORT, the excess length hides above the top.
        const clusterBottom = cluster.getBoundingClientRect().bottom
        const RISE = -(clusterBottom - SHORT) // bottoms land at y=SHORT from the top
        gsap.set(cluster, { y: RISE, autoAlpha: 1 }) // hanging, full-length, excess off-screen

        // the "fall": after the hit, the sticks first SHAKE in place (rattling
        // loose, like real stuff about to drop), THEN the cluster DROPS DOWN to
        // its standing home (y:0) — the hidden upper length comes into view as it
        // falls. Small landing bounce + a knocked-loose wobble. No height anim.
        dropSticks = () => {
          const SHAKE = 0.6 // window in which the (staggered) pre-fall shakes play
          // pre-fall SHAKE: each tower jitters in place (a quick left/right shake —
          // NO rotation/swaying), its own start time + intensity, then returns to
          // x:0 (even repeat count) so it's perfectly straight before the drop.
          const shakeParams = [
            { delay: 0.0, amp: 3, step: 0.05 }, // stick 0: medium
            { delay: 0.1, amp: 2, step: 0.06 }, // stick 1: milder, later
            { delay: 0.05, amp: 4, step: 0.045 }, // stick 2: strongest
          ]
          sticks.forEach((stick, i) => {
            const p = shakeParams[i] ?? { delay: i * 0.08, amp: 3, step: 0.05 }
            const raw = Math.round((SHAKE - p.delay) / p.step)
            const reps = raw % 2 === 0 ? raw : raw + 1 // even → ends back at x:0
            gsap.to(stick, {
              x: p.amp,
              duration: p.step,
              delay: p.delay,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: reps,
            })
          })
          // THEN the whole cluster drops (after the shake window; sticks are straight)
          gsap
            .timeline({ delay: SHAKE })
            .to(cluster, { y: 0, duration: 0.55, ease: 'power2.in' }) // gravity fall (reveals full height)
            .to(cluster, { y: -16, duration: 0.16, ease: 'sine.out' }) // small rebound
            .to(cluster, { y: 0, duration: 0.24, ease: 'bounce.out' }) // settle on the floor
          // a gentle per-stick wobble about the base as they land (staggered)
          const order = [1, 0, 2].filter((idx) => sticks[idx])
          order.forEach((idx, i) => {
            const stick = sticks[idx]
            const t = SHAKE + 0.5 + i * 0.12
            gsap.to(stick, {
              rotation: 4,
              duration: 0.1,
              delay: t,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: 4,
              transformOrigin: '50% 100%',
            })
            gsap.to(stick, { rotation: 0, duration: 0.12, delay: t + 0.5, ease: 'sine.out', transformOrigin: '50% 100%' })
          })
        }
      }

      // 6d) SHOOT: a small ball fires fast from the wand tip UP to the hanging
      //     sticks. On impact it (a) keeps going and DROPS DOWN OUT OF THE SCREEN
      //     and (b) triggers the sticks to wobble + fall.
      if (projectileEl) {
        tl.add(() => {
          const tip = characterEl?.querySelector('.ch-wand path') as SVGElement | null
          const r = tip?.getBoundingClientRect()
          // aim at the hanging sticks (their current bottom dots' area)
          const sr = sticksEl?.getBoundingClientRect()
          if (r && sr) {
            const startX = r.left + r.width / 2 - 5
            const startY = r.top + r.height / 2 - 5
            const hitX = sr.left + sr.width / 2 // centre of the stick cluster
            // aim at the VISIBLE bottom tip of the hanging sticks (near the top
            // edge); the rest of the cluster is off-screen above, so use bottom.
            const hitY = Math.max(20, sr.bottom - 24)
            gsap.set(projectileEl!, { x: startX, y: startY, opacity: 1 })
            gsap.to(projectileEl!, {
              x: `+=${hitX - startX}`,
              y: `+=${hitY - startY}`,
              duration: 0.55,
              ease: 'none',
              onComplete() {
                // the ball keeps going, dropping down out of the screen…
                gsap.to(projectileEl!, {
                  y: `+=${window.innerHeight + 80}`,
                  x: '+=24',
                  duration: 0.7,
                  ease: 'power2.in',
                  onComplete() {
                    gsap.set(projectileEl!, { opacity: 0 })
                  },
                })
                // …then, 0.5s after the hit, the sticks start falling.
                gsap.delayedCall(0.5, () => dropSticks?.())
              },
            })
          }
        }, '+=0.1')
        // hold while the ball flies up + hits (0.55s), the 0.5s delay, the pre-fall
        // shake (0.6s), and the sticks fall (~1.0s).
        tl.to({}, { duration: 2.7 })
      }

      // 6f) AIM at the sticks: lower the wand back toward its resting angle so it
      //     points DOWN-RIGHT (south-east) at the bottom-right sticks.
      if (rightArm) {
        tl.to(rightArm, { rotation: -32, svgOrigin: '54 46', duration: 0.4, ease: 'power2.inOut' }, '+=0.1')
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
                startDotBounce(dot)
              },
            })
          })
        }, '+=0.15')
        // hold the timeline while all 3 balls fire (0.5s apart) + land
        tl.to({}, { duration: 1.6 })
      }

      // 6h) THE TOP BAR FALLS IN. (The old corner-by-corner pull sequence was ~6s;
      //     per the speed-up the bar now DROPS into its seat with a small rebound.)
      //     Beats: put the right-hand wand away → look up-left → the wizard raises
      //     his LEFT wand and POINTS UP to summon the bar → the bar falls on that cue.
      const leftArmTop = characterEl?.querySelector('.ch-leftarm') as SVGElement | null
      const wandLeftTop = characterEl?.querySelector('.ch-wand-left') as SVGElement | null
      if (headGroup && topBarEl) {
        // 1) put the (right-hand) wand away: lower the right arm to rest + hide it
        if (rightArm) tl.to(rightArm, { rotation: 0, svgOrigin: '54 46', duration: 0.35, ease: 'power2.inOut' }, '+=0.15')
        if (wand) tl.set(wand, { autoAlpha: 0 })
        // 2) look up-left toward where the bar will drop from
        tl.to(headGroup, { scaleX: -1, svgOrigin: '50 26', duration: 0.4, ease: 'power2.inOut' }, '+=0.1')
        // 3) RAISE the left wand and POINT UP — the summon gesture. The bar falls
        //    ON this cue (starts as the point completes), so the fall reads as the
        //    RESULT of the wizard's gesture, not an unrelated drop.
        if (leftArmTop && wandLeftTop) {
          tl.set(wandLeftTop, { autoAlpha: 1 })
          tl.to(leftArmTop, { rotation: 125, svgOrigin: '46 46', duration: 0.45, ease: 'back.out(1.4)' }, '+=0.1')
        }
        // 4) the bar DROPS on the summon: gravity fall, a small rebound, settle.
        const bar = topBarEl
        tl.to(bar, { y: 0, duration: 0.5, ease: 'power2.in' }, leftArmTop ? '>-0.1' : '+=0.15')
        tl.to(bar, { y: -12, duration: 0.14, ease: 'sine.out' })
        tl.to(bar, { y: 0, duration: 0.22, ease: 'bounce.out' })
        // 5) lower the wand hand back to rest once the bar is seated.
        if (leftArmTop) tl.to(leftArmTop, { rotation: 0, svgOrigin: '46 46', duration: 0.35, ease: 'power2.inOut' })
      }

      // 6i) DRAG IN THE LEFT WALL. The wizard turns his wand to point STRAIGHT
      //     LEFT (90° from straight up) and hauls the heavy brown wall in from
      //     off-screen left. As it grinds in, little ROCK chips break off its
      //     bottom (~5rem up), hop, and drop to the floor — the friction of a
      //     big rock being dragged.
      if (leftBarEl && rocksEl) {
        const lArm = characterEl?.querySelector('.ch-leftarm') as SVGElement | null
        const lWand = characterEl?.querySelector('.ch-wand-left') as SVGElement | null
        const wall = leftBarEl
        const rockLayer = rocksEl
        // fallen balls recorded here so the next beat can fly some up into the "+"
        const fallenRocks: { el: HTMLElement; x: number; y: number }[] = []

        // 1) swing the (left-hand) wand from "up" round to point STRAIGHT LEFT
        if (lArm && lWand) {
          tl.set(lWand, { autoAlpha: 1 })
          tl.to(lArm, { rotation: 59, svgOrigin: '46 46', duration: 0.5, ease: 'power2.inOut' }, '+=0.15')
        }

        // 2) HAUL the wall in. A heavy, grinding pull (slow start, easing to a
        //    stop) — not a snap. It travels from off-screen left to x:0.
        tl.addLabel('wallDrag')
        tl.to(wall, { xPercent: 0, duration: 1.6, ease: 'power2.out' }, 'wallDrag')

        // 3) ROCK CHIPS break off the wall's bottom while it's being dragged.
        //    Spawned across the drag so they keep flaking off as it grinds in,
        //    each hops up a little then falls to the floor and STAYS.
        tl.add(() => {
          const wallW = wall.offsetWidth || 20
          const baseY = window.innerHeight // floor = bottom of the screen
          // EXACTLY enough chips for all the left-side marks, so NONE remain on
          // the floor afterwards: 5 for the "+", 3 for the top "⋮", 4 for the
          // bottom-left cradle = 12.
          const COUNT = 12
          // chips break off at VARIED heights along the wall — from near the floor
          // up to near the TOP — then each falls down to the floor.
          const TOP_MARGIN = 40 // highest a chip breaks off (px from the top)
          const span = baseY - TOP_MARGIN // full range of break heights
          for (let i = 0; i < COUNT; i++) {
            const rock = document.createElement('div')
            rock.className = 'rock' // 9px ink dot (sized in CSS), like the left-side dots
            rockLayer.appendChild(rock)
            // break point: spread across the wall's height (top → bottom), the
            // sequence interleaved so high/low chips alternate as the wall grinds in
            const frac = ((i * 5) % COUNT) / COUNT // 0..1 scattered, not monotonic
            // start INSIDE the wall (between its edges) so the chip looks like part
            // of it, then it breaks free and falls OUT to the floor.
            const startX = 2 + (i % 3) * ((wallW - 6) / 3) // inside the 20px wall
            const startY = TOP_MARGIN + frac * span // varied height up the wall
            const wallEdge = wallW // the wall's right edge (chips fall just past it)
            const restX = wallEdge + 4 + (i % 4) * 5 // settle just outside the wall
            const restY = baseY - 2 - (i % 5) // settle on the floor (slight pile)
            gsap.set(rock, { x: startX, y: startY, opacity: 0 })
            const t = (i / COUNT) * 1.3
            const fallDist = restY - startY
            const fallDur = Math.max(0.3, Math.min(0.95, fallDist / 700))
            gsap.to(rock, { opacity: 1, duration: 0.08, delay: t })
            // every 3rd chip BOUNCES off the wall's right edge on the way down
            const bounces = i % 3 === 0 && fallDist > 120
            const drop = gsap.timeline({ delay: t })
            // break free of the wall: a little nudge out + down
            drop.to(rock, { x: wallEdge - 2, y: startY + 12, duration: 0.14, ease: 'power2.in' })
            if (bounces) {
              // fall, CLIP the wall edge and bounce back out, then continue down
              const midY = startY + (restY - startY) * 0.55
              drop
                .to(rock, { x: wallEdge + 1, y: midY, duration: fallDur * 0.5, ease: 'power2.in' }) // fall onto the edge
                .to(rock, { x: wallEdge + 10, duration: 0.12, ease: 'power2.out' }) // bounce OUT off the wall
                .to(rock, { x: restX, y: restY, duration: fallDur * 0.5, ease: 'power2.in' }) // finish the fall + STAY
            } else {
              drop.to(rock, { x: restX, y: restY, duration: fallDur, ease: 'power2.in' }) // gravity fall out + STAY
            }
            fallenRocks.push({ el: rock, x: restX, y: restY })
          }
        }, 'wallDrag+=0.15')

        // hold the timeline while the wall finishes dragging in
        tl.to({}, { duration: 1.6 }, 'wallDrag')

        // 6j) ASSEMBLE THE "+" AND THE 3 DOTS TOGETHER. (Previously two separate
        //     beats — one hand-rise for the "+", lower, point back, another rise for
        //     the dots. Per the speed-up both marks are levitated in the SAME rise:
        //     one hand lift, 8 balls fly at once — 5 into the cross, 3 into the
        //     dot-stack under it.)
        if (lArm && plusEl) {
          // lower the hand to rest (wand stays in it), a short beat, then a 20°
          // nudge toward the rubble…
          tl.to(lArm, { rotation: 0, svgOrigin: '46 46', duration: 0.4, ease: 'power2.inOut' }, '+=0.2')
          tl.to(lArm, { rotation: 20, svgOrigin: '46 46', duration: 0.4, ease: 'power2.out' }, '+=0.3')
          // …then the magic takes hold: the hand rises HIGH and ALL EIGHT balls
          // float up together — 5 into the "+" (which then spins forever) and 3
          // into the dot-stack beneath it.
          tl.addLabel('marksRise', '+=0.2')
          tl.to(lArm, { rotation: 120, svgOrigin: '46 46', duration: 1.0, ease: 'power2.inOut' }, 'marksRise')
          tl.add(() => {
            // the "+": 5 balls into a cross (centre, up, down, left, right)
            const target = plusEl!.getBoundingClientRect()
            const tx = target.left + target.width / 2
            const ty = target.top + target.height / 2
            const ARM = 12 // distance of each arm ball from the centre (px)
            const C = 4.5 // half the 9px ball (its own centre)
            const slots = [
              [0, 0],
              [0, -ARM],
              [0, ARM],
              [-ARM, 0],
              [ARM, 0],
            ]
            const chosen = fallenRocks.slice(0, slots.length)
            chosen.forEach((r, i) => {
              const [ox, oy] = slots[i]
              gsap.to(r.el, {
                x: tx - C + ox,
                y: ty - C + oy,
                duration: 1.0,
                delay: i * 0.06,
                ease: 'power2.inOut',
                onComplete:
                  i === chosen.length - 1
                    ? () => {
                        // the balls now sit in a "+" — keep them as the mark and
                        // SPIN the whole cross rigidly about its shared centre.
                        startPlusSpin(chosen.map((c) => c.el), slots, C)
                      }
                    : undefined,
              })
            })
            // the 3 dots under the "+": rise in the SAME breath
            if (topDotsEl) {
              const dotEls = Array.from(topDotsEl.querySelectorAll('.dot')) as HTMLElement[]
              const picks = fallenRocks.slice(5, 8)
              dotEls.forEach((dotEl, i) => {
                const r = dotEl.getBoundingClientRect()
                const ball = picks[i]?.el
                if (!ball) return
                gsap.to(ball, {
                  x: r.left + r.width / 2 - 4.5,
                  y: r.top + r.height / 2 - 4.5,
                  duration: 1.0,
                  delay: i * 0.08,
                  ease: 'power2.inOut',
                })
              })
            }
          }, 'marksRise')
          // hold while all 8 balls float into place (hand stays up — the cradle
          // beat follows IMMEDIATELY, no lower/re-raise between).
          tl.to({}, { duration: 1.0 })

          // 6l) FINALE — the bottom-left 4 dots, IMMEDIATELY after the "+"/dots (no
          //     waiting/lower/re-raise, per the speed-up). The hand sweeps straight
          //     from its raised 120° down to the low 30° cradle-lift as the FINAL 4
          //     balls rise into the vertical dot stack — then the perpetual NEWTON'S-
          //     CRADLE loop starts. After the first cycle the wizard puts the wand
          //     away, looks around, and walks BACK INTO the line, disappearing.
          if (bottomDotsEl) {
            const dotsGroup = bottomDotsEl
            const lWandFinale = characterEl?.querySelector('.ch-wand-left') as SVGElement | null

            // the hand sweeps 120° → 30° (the low cradle lift) while the balls rise.
            tl.addLabel('cradleRise')
            tl.to(lArm, { rotation: 30, svgOrigin: '46 46', duration: 0.8, ease: 'power2.inOut' }, 'cradleRise') // sweep down to the 30° lift
            // capture the 4 cradle balls (top → bottom) + their TRUE rest positions
            const cradle: HTMLElement[] = []
            const cradleRest: number[] = []
            tl.add(() => {
              const dotEls = Array.from(dotsGroup.querySelectorAll('.dot')) as HTMLElement[]
              const picks = fallenRocks.slice(8, 12) // the LAST 4 rubble balls
              dotEls.forEach((dotEl, i) => {
                const r = dotEl.getBoundingClientRect()
                const ball = picks[i]?.el
                if (!ball) return
                const restY = r.top + r.height / 2 - 4.5 // its resting dot position
                gsap.to(ball, {
                  x: r.left + r.width / 2 - 4.5,
                  y: restY,
                  duration: 0.8,
                  delay: i * 0.08,
                  ease: 'power2.inOut',
                })
                cradle[i] = ball
                cradleRest[i] = restY
              })
            }, 'cradleRise')
            tl.to({}, { duration: 0.85 }) // hold while they line up

            // pre-lift the top ball SMOOTHLY to its cradle peak (no delay before the
            // motion) — it rises with the wand, then the cradle drops it from there
            // with no pop. Passing the TRUE rests so the drop lands on the dot.
            tl.addLabel('cradleGo')
            tl.add(() => {
              const topBall = cradle[0]
              if (topBall && cradleRest[0] != null) {
                gsap.to(topBall, { y: cradleRest[0] - NEWTON_TOP_LIFT, duration: 0.3, ease: 'power2.out' })
              }
            }, 'cradleGo')
            // start the perpetual cradle ~when the pre-lift completes (so the first
            // drop begins from the peak, matching the wand's down-flick)
            tl.add(() => {
              if (cradle.length === 4) startNewtonsCradle(cradle, cradleRest)
            }, 'cradleGo+=0.3')
            // the wand's up/down movement, timed with the cradle impacts: as the
            // top ball DROPS (begins at cradleGo+0.3) the wand strokes DOWN so it
            // bottoms out on the impact, then bobs back up as the ball returns.
            // Bob between ~15° and 30°. Arm pivots at the SHOULDER (46 46).
            tl.to(lArm, { rotation: 15, svgOrigin: '46 46', duration: 0.32, ease: 'power2.in' }, 'cradleGo+=0.3') // down = the hit
            tl.to(lArm, { rotation: 30, svgOrigin: '46 46', duration: 0.48, ease: 'power2.out' }) // back up as it returns
            tl.to(lArm, { rotation: 15, svgOrigin: '46 46', duration: 0.32, ease: 'power2.in' }) // second bob in time
            tl.to(lArm, { rotation: 30, svgOrigin: '46 46', duration: 0.48, ease: 'power2.out' })

            // 6m) once the first cradle cycle has run, the wizard EXITS: lower the
            //     hand, hide the wand, look RIGHT then back LEFT, then walk BACK
            //     INTO the line and disappear — facing LEFT (into the line), NOT
            //     facing right. (Reverse of his entrance.)
            if (headGroup) {
              // the wand bob above already covered ~one cradle cycle; a short
              // extra beat, then the wizard leaves (cradle keeps running forever).
              tl.to({}, { duration: 0.2 })
              // lower the left hand + hide the wand
              tl.to(lArm, { rotation: 0, svgOrigin: '46 46', duration: 0.4, ease: 'power2.inOut' })
              if (lWandFinale) tl.set(lWandFinale, { autoAlpha: 0 })
              // look RIGHT (face forward/right), pause, then look LEFT toward the line
              tl.to(headGroup, { scaleX: 1, svgOrigin: '50 26', duration: 0.4, ease: 'power2.inOut' }, '+=0.1')
              tl.to(headGroup, { scaleX: -1, svgOrigin: '50 26', duration: 0.4, ease: 'power2.inOut' }, '+=0.15')
              // re-enable the line clip so he's hidden as he steps back behind it
              tl.add(() => characterClipEl?.classList.add('clipping'))
              // RETREAT the SAME WAY HE ENTERED: walk left back to the line and on
              // into it, with the same staggered up/down body BOB as the walk-out.
              const RET_DUR = 1.5
              const RET_STEPS = 5
              tl.to(characterEl!, { x: -charW0, duration: RET_DUR, ease: 'none' }, '+=0.1') // travel back into the line
              tl.to(
                characterEl!,
                { y: `-=6`, duration: RET_DUR / (RET_STEPS * 2), ease: 'sine.inOut', yoyo: true, repeat: RET_STEPS * 2 - 1 },
                '<', // bob in sync with the walk (same as entrance)
              )
            }
          }
        }
      }
    }

    // 7) Welcome slides left out from behind the divider (no fade), slower —
    //    starting 0.3s AFTER the wizard has fully disappeared into the line.
    tl.addLabel('welcomeIn', '+=0.3')
    tl.to(title, { x: 0, duration: 1.0, ease: 'power3.out' }, 'welcomeIn')

    // 6) tagline (right-side text) slides in 0.57s AFTER the Welcome text starts.
    const taglineStart = WELCOME_LEADS ? 'welcomeIn+=0.57' : '<'
    tl.to(tagline, { x: 0, duration: 1.0, ease: 'power3.out' }, taglineStart)

  }
</script>

<svelte:window on:keydown={onKey} />

<IconSprite />

<!-- The character is anchored at screen centre (where the divider line is) and
     WALKS OUT of the line on load. A clip box pinned with its LEFT edge at the
     line hides him while he's behind it, so he genuinely emerges FROM the line
     (same trick as the Welcome text mask). The clip is only `overflow:hidden`
     while `.clipping` is set (during the walk); it's removed before he raises
     the wand so the raised wand/star isn't cropped. -->
<div class="character-clip" bind:this={characterClipEl}>
  <div class="character-anchor" bind:this={characterEl}><Character /></div>
</div>

<!-- MOBILE-only intro dot: a fixed dot centred on screen that drops in from off
     the top, splashes, then stretches into the Welcome slide's horizontal line.
     The real per-slide separator stays plain CSS (identical on every slide); this
     overlay just performs the form-in, then hands off + removes itself. -->
<div class="mobile-intro-dot" bind:this={mobileDotEl}></div>

<!-- the first small ball the wizard shoots (knocks the sticks down) -->
<div class="projectile" bind:this={projectileEl}></div>

<!-- little "rock" chips that break off the bottom of the left wall as the wizard
     drags it in (rock-being-moved illusion); spawned + animated from JS, then
     left resting on the floor. -->
<div class="rocks" bind:this={rocksEl}></div>

<!-- 3 balls the wizard shoots; each flies to a stick top and becomes its dot -->
{#each [0, 1, 2] as i}
  <div class="split-ball" bind:this={splitBalls[i]}></div>
{/each}

<!-- SKIP button: fast-forwards the desktop load animation to its end. Only shown
     while the wizard load is running; hidden on mobile via CSS (the wizard doesn't
     play there, so there's nothing to skip). Bottom-right, bordered. -->
{#if showSkip}
  <button class="skip-load" type="button" onclick={skipLoad}>Skip</button>
{/if}

<!-- ANIMATED MODE: a full-screen placeholder overlay (animated gradient bg +
     "Coming soon"). Covers everything EXCEPT the top-bar toggle, which stays on
     top so the user can switch back. -->
{#if mode === 'animated'}
  <AnimatedScreen />
{/if}

<Shell {mode} onModeChange={(m) => (mode = m)} animatedLocked={loadLocked} indicator={displayedLabel} bind:indicatorEl bind:dividerEl bind:furnitureEl bind:sticksEl bind:topBarEl bind:leftBarEl bind:plusEl bind:topDotsEl bind:bottomDotsEl>
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
  @use './styles/responsive' as r; // lib-backed breakpoint mixins

  // Clip box pinned with its LEFT edge at the screen centre (the divider line).
  // While `.clipping` is set it hides anything to the LEFT of the line, so the
  // character emerges from behind the line as he walks right. It's TALL and tall-
  // centred so it never crops him vertically; the clip is removed after the walk
  // so the later raised wand (which extends upward) isn't cut off.
  .character-clip {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 60vw; // room for the full walk-out to the right
    height: 200vh; // tall enough to never clip the figure top/bottom
    transform: translateY(-50%);
    z-index: 2; // above the divider line
    overflow: visible;
    pointer-events: none;
  }
  // `.clipping` is toggled by JS at runtime, so :global() stops Svelte pruning it.
  .character-clip:global(.clipping) {
    overflow: hidden; // active only during the walk-out (emerge from the line)
  }

  // The character sits at the clip's left edge (= the line). GSAP translates it
  // RIGHT (x) to walk it out from behind the line.
  .character-anchor {
    position: absolute;
    top: 50%;
    left: 0;
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

  // MOBILE intro dot: fixed, centred on screen, ink-coloured. JS drops it in and
  // grows it into the Welcome line, then hides it. A pill radius gives it a round
  // shape as a dot and rounded caps once it's a line. Hidden by default (desktop
  // never shows it; on mobile JS sets autoAlpha).
  .mobile-intro-dot {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 12px;
    height: 12px;
    // centring is handled by GSAP (xPercent/yPercent:-50) so its resize stays
    // symmetric about the centre; no CSS transform here to avoid conflicting.
    background-color: var(--color-ink);
    border-radius: 999px;
    opacity: 0;
    z-index: 4;
    pointer-events: none;
  }

  // Layer holding the little rock chips that break off the wall as it's dragged.
  // Chips are spawned into it from JS and positioned absolutely.
  .rocks {
    position: fixed;
    inset: 0;
    z-index: 1; // above the page bg; chips skitter right of the wall as debris
    pointer-events: none;
  }
  // Each chip is a 9px ink dot — identical to the left-side `.dot` marks (the
  // "⋮" dots), since these chips become the left-side elements afterwards.
  .rocks :global(.rock) {
    position: fixed;
    top: 0;
    left: 0;
    width: 9px;
    height: 9px;
    background-color: var(--color-ink);
    border-radius: 50%;
  }


  // SKIP button: bottom-right, bordered, ink-coloured. Fixed above everything so
  // it's clickable over the running animation. Hidden on mobile (≤sm) since the
  // wizard load doesn't run there.
  .skip-load {
    position: fixed;
    right: 1.5rem;
    bottom: 1.5rem;
    z-index: 10;
    padding: 0.5rem 1.1rem;
    font-family: inherit;
    font-size: 0.95rem;
    font-weight: 400;
    letter-spacing: 0.02em;
    color: var(--color-ink);
    background: transparent;
    border: 1px solid var(--color-ink);
    border-radius: 8px;
    cursor: pointer;
    opacity: 0.7;
    transition:
      opacity 0.15s ease,
      background-color 0.15s ease;
  }
  .skip-load:hover,
  .skip-load:focus-visible {
    opacity: 1;
    background: color-mix(in srgb, var(--color-ink) 8%, transparent);
  }
  @include r.mobile {
    .skip-load {
      display: none; // no wizard load on mobile → nothing to skip
    }
  }

  // All slides stacked in the same place; GSAP fades between them.
  .deck {
    position: relative;
    height: 100vh;
    height: 100dvh; // track the mobile URL-bar collapse (no extended area)
    overflow: hidden;
  }

  .panel {
    position: absolute;
    inset: 0;
  }

  // MOBILE (≤768px): the wizard intro doesn't run (playMobileLoad replaces it),
  // so hide the wizard + all his loose load-animation props entirely.
  @include r.mobile {
    .character-clip,
    .projectile,
    .rocks,
    .split-ball {
      display: none;
    }
  }
</style>
