<script lang="ts">
  // Scroll hint: "Scroll" label + cursor icon (Figma skills template). Fades in
  // and out on a slow loop to invite scrolling. Shown only when a slide's
  // content overflows, and hidden once the user has scrolled it (controlled by
  // the parent via the `visible` prop).
  interface Props {
    visible: boolean
  }
  let { visible }: Props = $props()
</script>

{#if visible}
  <div class="scroll-hint" aria-hidden="true">
    <span class="label">Scroll</span>
    <svg class="cursor" viewBox="0 0 24 24"><use href="#icon-cursor" /></svg>
  </div>
{/if}

<style lang="scss">
  .scroll-hint {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    color: var(--color-ink);
    // the whole hint (label + cursor) fades in and out on a loop
    animation: hint-fade 2.4s ease-in-out infinite;
  }

  .label {
    font-size: 0.95rem;
    font-weight: 400;
  }

  // The cursor additionally glides down to demonstrate the scroll/drag.
  .cursor {
    width: 1.1rem;
    height: 1.1rem;
    animation: hint-drag 2.4s ease-in-out infinite;
  }

  // Label + cursor fade together: in at the start, hold, out, repeat.
  @keyframes hint-fade {
    0% {
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    70% {
      opacity: 1;
    }
    90%,
    100% {
      opacity: 0;
    }
  }

  // Cursor drag (synced to the same timeline): glide down while visible, reset.
  @keyframes hint-drag {
    0%,
    20% {
      transform: translateY(0);
    }
    70%,
    90% {
      transform: translateY(14px);
    }
    100% {
      transform: translateY(0);
    }
  }
</style>
