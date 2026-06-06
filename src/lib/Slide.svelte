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
    compact?: boolean // mobile: cap the scrollable area shorter (e.g. Skills)
    children?: import('svelte').Snippet
  }
  let { title, hero = false, scrollable = false, compact = false, children }: Props = $props()

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
    <div class="content-col" class:compact>
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
  @use '../styles/responsive' as r; // lib-backed breakpoint mixins

  .slide {
    height: 100vh;
    height: 100dvh; // mobile: track the URL-bar collapse so the slide is 1 screen
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
    // the scrollable area itself isn't clickable — only project ROWS are (they
    // set their own pointer cursor). So it uses the default cursor here.
  }

  // reserves no space when empty; the hint shows only on overflow
  .hint-slot {
    flex: 0 0 auto;
  }

  // ---------------------------------------------------------------------------
  // MOBILE (≤768px): HORIZONTAL split — the separator is a horizontal line across
  // the slide; the TITLE sits ABOVE it and the CONTENT BELOW it (full width). The
  // whole title+line+content block is vertically CENTRED in the slide. Slides
  // change on a left/right swipe (App.svelte); content scrolls up/down inside.
  // Type scale researched (learnui.design / Pimp My Type / 3 others): hero ~36px,
  // titles ~30px, body ~16px.
  // ---------------------------------------------------------------------------
  @include r.mobile {
    .slide {
      align-items: stretch;
      padding: 4.5rem 1.5rem 3rem; // clear the top furniture + side gutters
      box-sizing: border-box;
    }

    // single column; three rows: [title half][line][content half]. The two 1fr
    // halves are EQUAL, with the line between them at the vertical centre — so the
    // title (bottom-aligned in its half) and content (top-aligned in its half)
    // sit equidistant from the line. Fixes the "text sits low / unbalanced" issue.
    // The block is LIFTED above centre: the top row is smaller than the bottom
    // row, so the line sits higher and the content half gets more room (the long
    // Skills list was clipping over the bottom furniture when centred). Title sits
    // at the bottom of the (shorter) top row, just above the line.
    .grid {
      grid-template-columns: 1fr;
      grid-template-rows: 0.5fr auto 1fr;
      align-items: stretch;
      justify-items: stretch;
      row-gap: 1rem;
      height: 100%;
    }

    // TITLE — bottom of the top half, so it ends just above the line.
    .title-mask {
      grid-row: 1;
      justify-self: stretch;
      align-self: end;
      overflow: visible;
    }
    // data-slide titles (Projects / Skills & Tools / About me): as large as they
    // fit on one/two lines without clipping. vw-scaled, capped.
    .title {
      text-align: center; // centred above the line on mobile
      padding-right: 0;
      font-size: min(9vw, 2.75rem);
      white-space: normal;
      line-height: 1.1;
    }
    // the Welcome hero title runs bigger — there's room on the front page; push it
    // toward the desktop scale (still capped so it doesn't wrap on 375px).
    .title.hero {
      // "Welcome" sized to the LARGEST that still fits on one row without
      // clipping. Measured: it fills the content width (~327px at 375vw) at
      // ~4.7rem, so 18.5vw scales it to that edge on any width while capping at
      // 5.5rem on wide phones — never clips, never wraps.
      font-size: min(18.5vw, 5.5rem);
      font-weight: 500; // heavier, closer to desktop hero presence
    }

    // SPACER becomes the horizontal separator line itself (the Shell's fixed
    // vertical divider is hidden on mobile — see Shell.svelte). 4rem inset each
    // side via the slide padding above + this margin keeps it off the edges.
    .spacer {
      grid-row: 2;
      width: 100%;
      height: 4px;
      background-color: var(--color-ink);
      border-radius: 999px;
    }

    // CONTENT — below the line, full width, fills the remaining row and scrolls.
    .content-col {
      grid-row: 3;
      width: 100%;
      max-width: 100%;
      min-width: 0;
      height: 100%;
      min-height: 0;
      gap: 0;
    }
    .content {
      padding-left: 0;
      padding-right: 0;
      font-size: 1rem; // ~16px body
      min-width: 0;
      text-align: center; // centre the content text below the line on mobile
    }
    .content.scrollable {
      flex: 1;
      height: auto;
      min-height: 0;
      max-height: 100%;
      overflow-y: auto;
    }
    // `compact` slides (e.g. Skills) cap the scrollable MUCH shorter so the
    // visible block ends well ABOVE the bottom-right sticks/animations — only a
    // few rows show, then it scrolls. Still the SINGLE scroller, so the
    // overflow-driven scroll hint keeps working.
    .content-col.compact .content.scrollable {
      flex: 0 1 auto;
      max-height: 62%; // a few more rows before it scrolls
    }
    // wider gap between the (compact) content and the scroll hint below it
    .content-col.compact .hint-slot {
      margin-top: 1.25rem;
    }
    // the content-col stacks the content over the hint on mobile (vs side-by-side
    // on desktop) so the scroll hint sits centred BELOW the scrollable content.
    .content-col {
      flex-direction: column;
      align-items: center;
    }
    .content {
      width: 100%;
    }
    .hint-slot {
      // shown only when content overflows (the hint itself self-hides otherwise);
      // a small centred "Scroll" cue under the list.
      margin-top: 0.25rem;
    }
  }
</style>
