<script lang="ts">
  // Mode toggle pill: "Straightforward" vs "Animated".
  // For now only Straightforward is functional and selected; Animated is shown
  // but inert (the animated mode is built much later). The active option is
  // tracked so wiring real behaviour later is a small change.
  type Mode = 'straightforward' | 'animated'
  let mode: Mode = $state('straightforward')

  // Animated is intentionally not selectable yet.
  function select(next: Mode) {
    if (next === 'animated') return // inert for now
    mode = next
  }
</script>

<div class="toggle" role="group" aria-label="Display mode">
  <button
    class="option"
    class:active={mode === 'straightforward'}
    onclick={() => select('straightforward')}
  >
    Straightforward
  </button>
  <button
    class="option inert"
    class:active={mode === 'animated'}
    onclick={() => select('animated')}
    aria-disabled="true"
    title="Coming later"
  >
    Animated
  </button>
</div>

<style lang="scss">
  .toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    background-color: var(--color-navbar); // #d9d9d9
    border-radius: 999px;
    padding: 0.4rem 0.6rem;
  }

  .option {
    border: none;
    background: transparent;
    color: var(--color-ink);
    font: inherit;
    font-size: 0.95rem;
    padding: 0.3rem 0.9rem;
    border-radius: 999px;
    cursor: pointer;
  }

  // The currently selected option gets a subtle filled look.
  .active {
    background-color: rgba(255, 255, 255, 0.5);
  }

  // Animated is present but not usable yet.
  .inert {
    opacity: 0.55;
    cursor: not-allowed;
  }
</style>
