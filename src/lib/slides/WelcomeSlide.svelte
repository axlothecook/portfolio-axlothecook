<script lang="ts">
  import Slide from '../Slide.svelte'

  // Tagline rendered as three explicit lines with decreasing font sizes
  // (mirrors the Figma): row 1 biggest (but smaller than "Welcome"), row 3
  // smallest.
  const taglineLines = ['To a place where', 'projects of passion', 'reside']
</script>

<Slide title="Welcome" hero>
  <p class="tagline">
    <span class="line line-1">{taglineLines[0]}</span>
    <span class="line line-2">{taglineLines[1]}</span>
    <span class="line line-3">{taglineLines[2]}</span>
  </p>
</Slide>

<style lang="scss">
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
  @media (max-width: 768px) {
    .tagline {
      align-items: center; // centre the tagline rows on mobile
      text-align: center;
    }
    .line {
      white-space: normal;
    }
    .line-1 {
      font-size: 1.5rem; // ~24px (H2)
    }
    .line-2 {
      font-size: 1.25rem; // ~20px (H3)
    }
    .line-3 {
      font-size: 1.0625rem; // ~17px (H4)
    }
  }
</style>
