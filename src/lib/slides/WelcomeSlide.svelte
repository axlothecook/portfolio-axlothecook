<script lang="ts">
  import Slide from '../Slide.svelte'

  // Tagline rendered as three explicit lines with decreasing font sizes
  // (mirrors the Figma): row 1 biggest (but smaller than "Welcome"), row 3
  // smallest.
  const taglineLines = ['To my energy drink', 'fuelled portfolio', 'page']
</script>

<Slide title="Welcome" hero>
  <p class="tagline">
    <span class="line line-1">{taglineLines[0]}</span>
    <span class="line line-2">{taglineLines[1]}</span>
    <span class="line line-3">{taglineLines[2]}</span>
  </p>
</Slide>

<style lang="scss">
  @use '../../styles/responsive' as r; // lib-backed breakpoint mixins

  .tagline {
    margin: 0;
    // fixed, equal gap between rows (line-height would make the gap scale with
    // each row's font size, producing unequal spacing).
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .line {
    display: block;
    white-space: nowrap;
    line-height: 1;
  }

  // Bigger fonts, with weight scaling up with size (bigger = thicker). line-1 and
  // line-2 are bumped heavier so the three rows read as a clearer hierarchy.
  .line-1 {
    font-size: 4rem;
    font-weight: 600;
  }

  .line-2 {
    font-size: 3rem;
    font-weight: 500;
  }

  .line-3 {
    font-size: 2.1rem;
    font-weight: 300;
    // optical balance: larger rows carry more internal font leading, so the
    // top↔middle gap reads bigger. Nudge the last row down to even it out.
    margin-top: 6px;
  }

  // MOBILE (≤768px): the tagline rows are too wide for a phone at desktop sizes.
  // Shrink to the researched mobile type scale (H2 ~24px, H3 ~20px, H4 ~17px) and
  // allow wrapping if a line still doesn't fit beside the divider.
  // MOBILE (≤768px): the tagline can run bigger than the earlier conservative
  // sizes — there's vertical room on the Welcome slide. Push toward the desktop
  // scale (kept a step smaller so the rows don't wrap on a 375px screen). Weights
  // inherit the bumped 600/500/300 from the base rules.
  @include r.mobile {
    .tagline {
      align-items: center; // centre the tagline rows on mobile
      text-align: center;
      gap: 0.5rem;
    }
    .line {
      white-space: normal;
    }
    // line-1 ("To my energy drink") fills ONE row at the largest size it can. It's a
    // long phrase (much wider than "Welcome"), so its one-row max is much
    // smaller than the hero. The vw size (capped) keeps it on a single line,
    // edge-to-edge, never clipping.
    .line-1 {
      white-space: nowrap;
      font-size: min(10.5vw, 2.5rem);
    }
    .line-2 {
      font-size: 2.1rem;
    }
    .line-3 {
      font-size: 1.6rem;
    }
  }
</style>
