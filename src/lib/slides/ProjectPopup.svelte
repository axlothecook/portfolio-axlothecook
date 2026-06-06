<script lang="ts">
  // Small popover shown when a project row is hovered/focused. Renders the
  // project's one-line summary plus a links footer with two word-links: "Live"
  // (the deployed site) and "Code" (the GitHub repo). Each link renders ONLY when
  // its URL exists on the project — so projects without a demo or a public repo
  // simply show fewer links (or none). Follows the theme via --color-bg/--color-ink.
  interface Props {
    summary: string
    liveUrl?: string
    repoUrl?: string
  }
  let { summary, liveUrl, repoUrl }: Props = $props()

  const hasLinks = $derived(Boolean(liveUrl || repoUrl))
</script>

<div class="popup" role="tooltip">
  <p class="summary">{summary}</p>
  {#if hasLinks}
    <p class="links">
      {#if liveUrl}
        <a href={liveUrl} target="_blank" rel="noopener noreferrer">Live</a>
      {/if}
      {#if liveUrl && repoUrl}<span class="sep">·</span>{/if}
      {#if repoUrl}
        <a href={repoUrl} target="_blank" rel="noopener noreferrer">Code</a>
      {/if}
    </p>
  {/if}
</div>

<style lang="scss">
  // A theme-aware card. It sits BELOW the hovered row (positioned by the parent),
  // and fills the parent wrap so it spans the FULL width of the right-side info
  // column. No box-shadow; tight inner padding so text isn't glued to the border.
  .popup {
    width: 100%;
    box-sizing: border-box;
    padding: 0.4rem 0.6rem;
    background-color: var(--color-bg);
    color: var(--color-ink);
    border: 1px solid color-mix(in srgb, var(--color-ink) 18%, transparent);
    border-radius: 0.5rem;
  }

  .summary {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 300;
    line-height: 1.4;
  }

  .links {
    margin: 0.55rem 0 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
  }

  .links a {
    color: var(--color-ink);
    text-decoration: underline;
    text-underline-offset: 2px;
    cursor: pointer;
  }
  .links a:hover {
    text-decoration-thickness: 2px;
  }

  .sep {
    opacity: 0.5;
  }
</style>
