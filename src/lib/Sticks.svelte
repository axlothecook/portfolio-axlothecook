<script lang="ts">
  // Decorative bottom-right motif: thin vertical sticks of varying height, each
  // topped with a dot, standing on the floor. On load they start short + equal,
  // hanging from the top of the screen; when the wizard's ball hits them they
  // FALL DOWN to this standing position and extend to their full heights.
  //
  // Heights as data so they're easy to tweak. `tall` marks the tallest stick
  // (its dot leads the ball-drop bounce).
  const sticks: { height: number; tall?: boolean }[] = [
    { height: 140 },
    { height: 250, tall: true },
    { height: 185 },
  ]
</script>

<div class="sticks">
  {#each sticks as stick}
    <div class="stick" class:tall={stick.tall} style="--stick-height: {stick.height}px">
      <span class="dot"></span>
      <span class="line"></span>
    </div>
  {/each}
</div>

<style lang="scss">
  // Standing on the floor: dots on top, lines below, aligned to the bottom edge.
  .sticks {
    display: flex;
    align-items: flex-end;
    gap: 1.1rem;
  }

  // Each stick: dot on top, thin line below. App drives the line's height (short
  // → full) on the drop; the dot rides on top.
  .stick {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .dot {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background-color: var(--color-ink);
    // no gap — the dot rests ON the line's top (a surface to bounce off later)
    opacity: 0; // hidden until the wizard's balls land and become them
  }

  .line {
    width: 4px;
    background-color: var(--color-ink);
    // App drives this: starts at the SHORT length, grows to full (--stick-height)
    // on the drop. Falls back to full if no JS.
    height: var(--line-height, var(--stick-height));
  }

  // MOBILE (≤768px): the wizard intro doesn't run, so (a) the dots are never
  // "placed" by the wizard → reveal them here, and (b) the cluster is tall for a
  // phone → scale it down from its bottom-right corner so it stays a small motif.
  @media (max-width: 768px) {
    .sticks {
      gap: 0.6rem;
      transform: scale(0.4);
      transform-origin: bottom right;
    }
    .dot {
      opacity: 1; // no wizard to land balls → show the dots directly
    }
  }
</style>
