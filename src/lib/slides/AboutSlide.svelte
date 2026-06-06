<script lang="ts">
  import Slide from '../Slide.svelte'
  import { about } from '../../data/about'
  import GitHubIcon from '../icons/GitHubIcon.svelte'
  import LinkedInIcon from '../icons/LinkedInIcon.svelte'
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
    <li class="socials">
      Socials:
      <a class="social" href={about.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        <GitHubIcon size="1.5rem" />
      </a>
      <a class="social" href={about.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
        <LinkedInIcon size="1.5rem" />
      </a>
    </li>
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

  // Socials row: label + linked icons.
  .socials {
    gap: 0.6rem;
  }
  .social {
    display: inline-flex;
    color: var(--color-ink);
    transition: opacity 0.2s ease;
  }
  .social:hover {
    opacity: 0.65;
  }
</style>
