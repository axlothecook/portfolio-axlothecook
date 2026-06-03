<script lang="ts">
  import Slide from '../Slide.svelte'
  import { projects } from '../../data/projects'
</script>

<Slide title="Projects">
  <ul class="list">
    {#each projects as project}
      <li class="project">
        <span class="name">{project.name}</span>
        {#if project.ongoing}<span class="ongoing">(ongoing)</span>{/if}
        <span class="tech">
          {#each project.tech as t}<span class="badge">{t}</span>{/each}
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
    gap: 0.6rem;
  }

  .project {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;
    font-weight: 300;
  }

  .ongoing {
    font-size: 0.9rem;
    opacity: 0.7;
  }

  .tech {
    display: inline-flex;
    gap: 0.3rem;
  }

  // Temporary text badges — the real tech icons come later.
  .badge {
    font-size: 0.7rem;
    padding: 0.1rem 0.35rem;
    border: 1px solid var(--color-ink);
    border-radius: 4px;
    opacity: 0.8;
  }
</style>
