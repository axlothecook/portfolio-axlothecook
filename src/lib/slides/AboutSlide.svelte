<script lang="ts">
  import Slide from '../Slide.svelte'
  import { about } from '../../data/about'
  import GitHubIcon from '../icons/GitHubIcon.svelte'
  import LinkedInIcon from '../icons/LinkedInIcon.svelte'
</script>

<Slide title="About me">
  <ul class="list">
    <li class="location">
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
  @use '../../styles/responsive' as r; // lib-backed breakpoint mixins

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

  // MOBILE (≤768px): shrink to the ~16px body scale + tighter row gap. The list
  // is centred as a BLOCK (fit-content + margin auto) with rows LEFT-aligned, so
  // every row STARTS at the same vertical line (like the Projects list), rather
  // than each row centring to a different start point.
  @include r.mobile {
    .list {
      font-size: 1rem; // ~16px body
      gap: 0.7rem;
      width: fit-content;
      max-width: 100%;
      margin-inline: auto;
      align-items: flex-start;
      text-align: left;
    }
    li {
      justify-content: flex-start;
    }
    // .list .pin (2 classes) so it OUT-SPECIFIES the base `.pin` rule, which appears
    // later in the source and would otherwise win even inside this media query.
    // Sized to the smaller mobile text (1rem) so it stays proportional + aligned.
    .list .pin {
      width: 1.3rem;
      height: 1.3rem;
    }
    .social :global(svg) {
      width: 1.2rem;
      height: 1.2rem;
    }
  }

  li {
    display: flex;
    align-items: center;
  }

  .pin {
    // Sized to the row's line-box (text is 1.4rem, line-height ~1.4 → ~2rem tall), so
    // the 1.5rem pin FITS inside the row and doesn't stretch it taller than the text
    // rows below. That's what keeps it aligned: an over-tall pin (1.7rem) overflowed
    // the 1.4rem line and its centre sagged below the text. The glyph is centred in
    // its own viewBox, so align-items:center on the row lines it up with the text.
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
  // The social icons do NOT change colour/appearance on hover, focus or active —
  // only the cursor signals they're clickable (pointer comes free from <a>). The
  // colour stays fixed at the theme ink in every interaction state.
  .social {
    display: inline-flex;
    color: var(--color-ink);
  }
  .social:hover,
  .social:focus,
  .social:focus-visible,
  .social:active {
    color: var(--color-ink); // unchanged in all interaction states
  }
</style>
