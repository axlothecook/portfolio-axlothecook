<script lang="ts">
  // Shared slide template: big title | (fixed shell divider) | content, as a
  // 3-column grid. The middle column is an empty spacer the width/position of
  // the fixed centre divider (which lives in the Shell), so titles and content
  // line up around it.
  //
  // `title` is the big left heading; right-hand content comes via the slot.
  // Content scrolls only if it overflows. The `.slide-text` wrappers are the
  // GSAP transition targets (move-up/fade). When the content overflows, a
  // ScrollHint invites scrolling and hides once the user scrolls.
  import { onMount, tick } from 'svelte'
  import ScrollHint from './ScrollHint.svelte'

  interface Props {
    title: string
    hero?: boolean // the Welcome slide uses an extra-large title
    scrollable?: boolean // data slides scroll on overflow; Welcome does not
    children?: import('svelte').Snippet
  }
  let { title, hero = false, scrollable = false, children }: Props = $props()

  let contentEl: HTMLElement | undefined = $state()
  let overflows = $state(false)
  let hasScrolled = $state(false)

  const showHint = $derived(overflows && !hasScrolled)

  function checkOverflow() {
    // only scrollable slides can overflow (Welcome never scrolls). Tolerance
    // avoids false positives from sub-pixel/line-box rounding.
    if (scrollable && contentEl)
      overflows = contentEl.scrollHeight > contentEl.clientHeight + 12
  }

  function onContentScroll() {
    if (contentEl && contentEl.scrollTop > 4) hasScrolled = true
  }

  onMount(() => {
    // A ResizeObserver re-checks whenever the content's box changes — including
    // when the slide first becomes visible and lays out at its real height
    // (a one-time onMount check can run while the panel is still hidden).
    const ro = new ResizeObserver(checkOverflow)
    if (contentEl) ro.observe(contentEl)
    window.addEventListener('resize', checkOverflow)
    tick().then(checkOverflow)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', checkOverflow)
    }
  })
</script>

<section class="slide">
  <div class="grid">
    <!-- title sits in a right-clipped mask so it can slide out from behind the
         divider on load (mask only active while .grid has the .loading class) -->
    <div class="title-mask">
      <h2 class="title slide-text" class:hero>{title}</h2>
    </div>
    <div class="spacer"></div>
    <!-- content sits in a left-clipped mask for the same reason -->
    <div class="content-col">
      <div
        class="content slide-text"
        class:scrollable
        class:scrolled={hasScrolled}
        bind:this={contentEl}
        onscroll={onContentScroll}
      >
        {@render children?.()}
      </div>
      <div class="hint-slot">
        <ScrollHint visible={showHint} />
      </div>
    </div>
  </div>
</section>

<style lang="scss">
  .slide {
    height: 100vh;
    display: flex;
    align-items: center;
  }

  // title | spacer (divider position) | content. The grid spans the FULL
  // viewport with two equal 1fr side columns, so the centre spacer sits exactly
  // at viewport-centre — lined up with the fixed shell divider.
  .grid {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    width: 100%;
  }

  // Mask wrapper around the title; its right edge sits at the divider.
  .title-mask {
    justify-self: end;
    overflow: visible; // becomes hidden during the load animation (.loading)
  }

  .title {
    text-align: right;
    // gap between the title and the divider
    padding-right: 3rem;
    font-size: 4.5rem;
    font-weight: 300;
    margin: 0;
    white-space: nowrap;
    line-height: 1.05;
  }

  // Welcome hero title — much larger and a touch heavier.
  .title.hero {
    font-size: 8rem;
    font-weight: 400;
  }

  // Empty column occupying the fixed divider's footprint.
  .spacer {
    width: 4px;
    height: var(--divider-height);
  }

  // content + scroll-hint side by side (hint to the right of the content).
  // The column is a FIXED width so the content box and the hint sit in the SAME
  // place on every slide — switching slides doesn't move them. The content
  // takes the available space; the hint sits at the column's right edge.
  .content-col {
    display: flex;
    align-items: center;
    gap: 2rem;
    width: 42rem;
  }

  // During the load animation, the title + content masks clip at the divider so
  // the text genuinely emerges from behind the line. `.loading` is toggled by App
  // at runtime, so it's wrapped in :global() to stop Svelte pruning these rules.
  :global(.grid.loading) .title-mask,
  :global(.grid.loading) .content-col {
    overflow: hidden;
  }

  .content {
    // gap from the divider — SAME as the title's gap on the left (3rem) so the
    // right-side text sits an equal distance from the separator line.
    padding-left: 3rem;
    padding-right: 1rem;
    flex: 1;
    min-width: 0; // allow the content to shrink so the hint always fits
  }

  // Only data slides scroll. Welcome (non-scrollable) never overflows.
  // The thin, arrow-less scrollbar styling lives in the GLOBAL stylesheet
  // (src/styles/index.scss) because ::-webkit-scrollbar pseudo-elements don't
  // work reliably under Svelte's component-scoped CSS.
  .content.scrollable {
    box-sizing: border-box;
    // 27px shorter than the centre divider line
    height: calc(var(--divider-height) - 27px);
    overflow-y: auto;
    // symmetric vertical padding so the first and last visible rows sit equally
    // far from the top and bottom of the box
    padding-block: 10px;
    cursor: pointer; // pointer cursor over the scrollable divs
  }

  // reserves no space when empty; the hint shows only on overflow
  .hint-slot {
    flex: 0 0 auto;
  }

  // ---------------------------------------------------------------------------
  // MOBILE (≤768px): keep the SAME side-by-side layout as desktop — title LEFT,
  // content RIGHT of the centred VERTICAL divider — just SHRUNK to fit a phone.
  // Researched mobile type scale (learnui.design / Pimp My Type / others): page
  // titles ~30px, hero ~36px, body ~16px, smaller gaps, narrower columns.
  // ---------------------------------------------------------------------------
  @media (max-width: 768px) {
    // tighten the side gaps to the divider so the two narrow columns fit 375px.
    // allow the title to WRAP (desktop keeps it on one line, but "Skills & Tools"
    // / "Google Drive Clone" overflow the narrow left column on a phone).
    .title {
      padding-right: 1rem;
      font-size: 1.875rem; // ~30px (mobile page title)
      white-space: normal;
    }
    .title.hero {
      font-size: 2.25rem; // ~36px (mobile H1 cap)
    }

    // shrink the divider spacer to the mobile divider width.
    .spacer {
      width: 4px;
    }

    // the content column fills its grid track (the right 1fr) and is capped there
    // — width:100% + min-width:0 stop the flex content from widening it past the
    // track (which would push the box partly off-screen on a narrow phone).
    .content-col {
      width: 100%;
      max-width: 100%;
      min-width: 0;
      gap: 0.75rem;
    }
    .content {
      // smaller gap from the divider; mirror the title's right padding.
      padding-left: 1rem;
      padding-right: 0.75rem;
      font-size: 1rem; // ~16px body
      min-width: 0; // let the content shrink to the column, wrapping its lines
    }
    // the side scroll-hint (a desktop affordance) takes no room on mobile.
    .hint-slot {
      display: none;
    }
  }
</style>
