<script lang="ts">
  import Slide from '../Slide.svelte'
  import { projects } from '../../data/projects'
  import { techIcons } from '../icons'
</script>

<Slide title="Projects" scrollable>
  <ul class="list">
    {#each projects as project}
      <li class="project">
        <span class="name">{project.name}</span>
        {#if project.ongoing}<span class="ongoing">(ongoing)</span>{/if}
        <span class="tech">
          {#each project.tech as t}
            {@const icon = techIcons[t]}
            <span class="badge" title={icon.label} aria-label={icon.label}>
              <!-- size="100%" → the SVG fills the fixed square badge box, which is
                   what actually centres every icon uniformly (see .badge styles) -->
              <icon.component size="100%" />
            </span>
          {/each}
        </span>
      </li>
    {/each}
  </ul>
</Slide>

<style lang="scss">
  .list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem; // matches About slide row gap (shared standard)
  }

  .project {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.4rem; // matches Skills/About (shared standard)
    font-weight: 300;
    line-height: 1.2;
  }

  .name {
    // keep the name on the same centre-line as the badges (flex already centres,
    // but pin line-height to 1 so the text box equals its glyph box)
    line-height: 1;
  }

  .ongoing {
    font-size: 0.9rem;
    opacity: 0.7;
    line-height: 1;
  }

  .tech {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  // Monochrome tech icons. Each icon is its own component with its OWN viewBox /
  // internal padding, so a bare SVG won't optically line up. The fix: give every
  // badge an IDENTICAL square box (--badge-size) and centre the SVG inside it
  // with place-items:center, so every glyph sits on the same centre-line as its
  // neighbours and as the text. currentColor → follows the theme ink.
  .badge {
    --badge-size: 1.15em; // square box, slightly larger than the 1em glyph

    display: grid;
    place-items: center;
    width: var(--badge-size);
    height: var(--badge-size);
    color: var(--color-ink);
    opacity: 0.85;

    // the SVG fills its box and is block-level so it centres to the box (not the
    // text baseline), removing the baseline drop inline SVGs otherwise have.
    :global(svg) {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
</style>
