<script lang="ts">
  import Slide from '../Slide.svelte'
  import { skills } from '../../data/skills'
</script>

<Slide title="Skills & Tools" scrollable>
  <ul class="list">
    {#each skills as group}
      <li class="line">
        {#if group.label}<span class="label">{group.label}:&nbsp;</span>{/if}{group.items}
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
    font-size: 1.4rem; // matches About
    font-weight: 300;
    line-height: 1.2; // enough for wrapping skill lines without inflating row gap
  }
</style>
