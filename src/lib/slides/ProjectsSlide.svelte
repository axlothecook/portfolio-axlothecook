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
              <icon.component size="1em" />
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

  .ongoing {
    font-size: 0.9rem;
    opacity: 0.7;
  }

  .tech {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  // Monochrome tech icons (each is its own component using currentColor, so they
  // follow the theme ink — brown in light mode, white in dark mode).
  .badge {
    display: inline-flex;
    align-items: center;
    color: var(--color-ink);
    opacity: 0.85;
  }
</style>
