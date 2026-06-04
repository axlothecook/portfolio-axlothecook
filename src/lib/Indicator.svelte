<script lang="ts">
  // Bottom-centre position indicator. The line placement differs per word
  // (from the Figma): Top → line above, Middle → lines on the sides, Bottom →
  // line below. The fade in/out is driven by the slide timeline in App.svelte
  // (via the bound element), so it stays perfectly in sync with the slide text.
  interface Props {
    label: string
  }
  let { label }: Props = $props()

  const placement = $derived(
    label === 'Top'
      ? 'above'
      : label === 'Bottom'
        ? 'below'
        : label === 'Middle'
          ? 'sides'
          : 'none',
  )
</script>

<div class="indicator-wrap">
  {#if label}
    <div class="indicator {placement}">
      {#if placement === 'sides'}<span class="line side"></span>{/if}
      <span class="word">{label}</span>
      {#if placement === 'sides'}<span class="line side"></span>{/if}
    </div>
  {/if}
</div>

<style lang="scss">
  .indicator-wrap {
    display: grid;
    place-items: center;
    min-height: 2.5rem;
  }

  .indicator {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
  }

  .word {
    position: relative; // anchor for the above/below line
    font-size: 1.4rem;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  .line {
    background-color: var(--color-ink);
  }

  .above .word::after,
  .below .word::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 3px;
    background-color: var(--color-ink);
  }

  .above .word::after {
    top: -0.5rem;
  }

  .below .word::after {
    bottom: -0.5rem;
  }

  .side {
    width: 2.2rem;
    height: 3px;
  }
</style>
