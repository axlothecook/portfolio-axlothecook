<script lang="ts">
  // Decorative bottom-right motif: thin vertical sticks of varying height, each
  // topped with a dot. Static here; animations (tallest dot bobs, cluster
  // lowers+grows off the hero slide) are added in feat/animations.
  //
  // Heights as data so they're easy to tweak. `tall` marks the tallest stick
  // (its dot leads the ball-drop bounce, built in feat/animations).
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
  .sticks {
    display: flex;
    align-items: flex-end;
    gap: 1.1rem;
  }

  // Each stick: dot on top, thin line below, total height driven by --stick-height.
  .stick {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: var(--stick-height);
  }

  .dot {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background-color: var(--color-ink);
    // no gap — the dot rests ON the stick top so it has a surface to bounce off
    opacity: 0; // hidden until the wizard's balls land and become them
  }

  .line {
    flex: 1;
    width: 4px;
    background-color: var(--color-ink);
  }
</style>
