<script lang="ts">
  import Slide from '../Slide.svelte'
  import { about } from '../../data/about'
</script>

<Slide title="About me">
  <ul class="list">
    <li>
      <svg class="pin" viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-location" /></svg>
      {about.location}
    </li>
    <li>Contact: {about.contact}</li>
    <li>Occupation: {about.occupation}</li>
    <li>Education: {about.education}</li>
  </ul>
</Slide>

<style lang="scss">
  .list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    font-size: 1.4rem;
    font-weight: 300;
  }

  li {
    display: flex;
    align-items: center;
  }

  .pin {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.4rem;
    color: var(--color-ink);
    flex: 0 0 auto;
  }
</style>
