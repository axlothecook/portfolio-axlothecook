<script lang="ts">
  // Shared slide template: big title | vertical divider | content, as a 3-column
  // grid. Every slide uses the same grid so the divider lines up across all of
  // them (reads as one continuous divider during scroll-snap).
  //
  // `title` is the big left heading; right-hand content comes via the slot.
  // Content scrolls only if it overflows.
  interface Props {
    title: string
    hero?: boolean // the Welcome slide uses an extra-large title
    children?: import('svelte').Snippet
  }
  let { title, hero = false, children }: Props = $props()
</script>

<section class="slide">
  <div class="grid">
    <h2 class="title" class:hero>{title}</h2>
    <div class="divider"></div>
    <div class="content">
      {@render children?.()}
    </div>
  </div>
</section>

<style lang="scss">
  // Each slide fills the viewport (scroll-snap target).
  .slide {
    height: 100vh;
    display: flex;
    align-items: center;
  }

  // title | divider | content. The grid is centred; the title column is
  // right-aligned so titles sit flush against the divider.
  .grid {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 2.5rem;
    width: 100%;
    max-width: 70rem;
    margin: 0 auto;
  }

  .title {
    justify-self: end;
    text-align: right;
    font-size: 4.5rem;
    font-weight: 300;
    margin: 0;
    white-space: nowrap;
    line-height: 1.05;
  }

  // Welcome hero title — much larger than the section titles.
  .title.hero {
    font-size: 8rem;
  }

  .divider {
    width: 2px;
    height: 18rem;
    background-color: var(--color-ink);
  }

  .content {
    max-height: 70vh;
    overflow-y: auto; // scrolls only if content is taller than this
    padding-right: 1rem;

    // Hide the scrollbar visually (the design has none); scroll still works.
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
</style>
