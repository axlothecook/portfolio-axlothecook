<script lang="ts">
  // Shared slide template: big title | (fixed shell divider) | content, as a
  // 3-column grid. The middle column is an empty spacer the width/position of
  // the fixed centre divider (which lives in the Shell), so titles and content
  // line up around it.
  //
  // `title` is the big left heading; right-hand content comes via the slot.
  // Content scrolls only if it overflows. The `.slide-text` wrappers are the
  // GSAP transition targets (move-up/fade).
  interface Props {
    title: string
    hero?: boolean // the Welcome slide uses an extra-large title
    children?: import('svelte').Snippet
  }
  let { title, hero = false, children }: Props = $props()
</script>

<section class="slide">
  <div class="grid">
    <h2 class="title slide-text" class:hero>{title}</h2>
    <div class="spacer"></div>
    <div class="content slide-text">
      {@render children?.()}
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

  .title {
    justify-self: end;
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
    height: 18rem;
  }

  .content {
    // gap from the divider so text never touches/crosses the line
    padding-left: 1.5rem;
    padding-right: 1rem;
    max-width: 34rem;
    max-height: 70vh;
    overflow-y: auto; // scrolls only if content is taller than this

    // Hide the scrollbar visually (the design has none); scroll still works.
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
</style>
