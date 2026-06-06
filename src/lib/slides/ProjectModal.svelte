<script lang="ts">
  // Mobile project modal: a centred card over a blurred backdrop. Shows the
  // project name + summary and the Live / Code buttons (each rendered only when
  // its URL exists). Closed via the X, a backdrop tap, or Escape.
  interface Props {
    name: string
    summary: string
    liveUrl?: string
    repoUrl?: string
    onClose: () => void
  }
  let { name, summary, liveUrl, repoUrl, onClose }: Props = $props()

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose()
  }
</script>

<svelte:window on:keydown={onKey} />

<!-- backdrop: tap it (outside the card) to close -->
<div
  class="backdrop"
  role="presentation"
  onclick={(e) => {
    if (e.target === e.currentTarget) onClose()
  }}
>
  <div class="modal" role="dialog" aria-modal="true" aria-label={name}>
    <button class="close" aria-label="Close" onclick={onClose}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>

    <h3 class="name">{name}</h3>
    <p class="summary">{summary}</p>

    {#if liveUrl || repoUrl}
      <div class="actions">
        {#if liveUrl}
          <a class="btn" href={liveUrl} target="_blank" rel="noopener noreferrer">Live</a>
        {/if}
        {#if repoUrl}
          <a class="btn" href={repoUrl} target="_blank" rel="noopener noreferrer">Code</a>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  // full-screen blurred backdrop centring the card
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: grid;
    place-items: center;
    padding: 1.5rem;
    background-color: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    animation: backdrop-in 0.18s ease;
  }

  // the card itself — fixed light (#eee) surface regardless of theme.
  .modal {
    position: relative;
    width: 100%;
    max-width: 22rem;
    box-sizing: border-box;
    padding: 1.5rem 1.25rem 1.25rem;
    background-color: #eee;
    color: #1e1f1c; // dark ink on the light card
    border-radius: 0.9rem;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
    animation: modal-in 0.2s ease;
  }

  // X close button, top-right
  .close {
    position: absolute;
    top: 0.6rem;
    right: 0.6rem;
    display: grid;
    place-items: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    border: none;
    background: transparent;
    color: #1e1f1c;
    cursor: pointer;
    border-radius: 50%;
    -webkit-tap-highlight-color: transparent;

    svg {
      width: 1.1rem;
      height: 1.1rem;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      fill: none;
    }
    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
  }

  .name {
    margin: 0 1.5rem 0.6rem 0; // clear the X
    font-size: 1.4rem;
    font-weight: 500;
  }

  .summary {
    margin: 0;
    font-size: 1rem;
    font-weight: 300;
    line-height: 1.45;
  }

  .actions {
    margin-top: 1.1rem;
    display: flex;
    gap: 0.6rem;
  }

  .btn {
    flex: 1;
    text-align: center;
    padding: 0.55rem 0.9rem;
    border-radius: 0.5rem;
    font-size: 0.95rem;
    text-decoration: none;
    background-color: #1e1f1c;
    color: #eee;
    -webkit-tap-highlight-color: transparent;

    &:active {
      opacity: 0.85;
    }
  }

  @keyframes backdrop-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes modal-in {
    from {
      opacity: 0;
      transform: translateY(8px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
</style>
