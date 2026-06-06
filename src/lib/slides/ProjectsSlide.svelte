<script lang="ts">
  import { onMount } from 'svelte'
  import Slide from '../Slide.svelte'
  import { projects } from '../../data/projects'
  import { techIcons } from '../icons'
  import ProjectPopup from './ProjectPopup.svelte'

  // The popup is rendered ONCE as a position:fixed layer (not inside each row),
  // so it can NEVER be clipped by the scrollable content box's overflow. Its
  // position is computed in JS from the hovered row's rect: it prefers to sit
  // BELOW the row, but FLIPS above when there isn't room below (bottom rows), and
  // is clamped to stay within the scroll container (top rows). It also re-tracks
  // on scroll. This makes the popup always fully visible wherever the row is.

  const GAP = 4 // px gap between the row and the popup
  const MARGIN = 6 // min px the popup keeps from the container edges

  let hovered = $state<number | null>(null)
  let listEl: HTMLUListElement | undefined = $state()
  let popupEl: HTMLElement | undefined = $state() // the fixed popup, for measuring
  let rowEls: HTMLElement[] = $state([])

  // computed inline style for the fixed popup
  let popupStyle = $state('')
  let positioned = $state(false) // hide until JS has placed it (avoids a 0,0 flash)
  let closeTimer: ReturnType<typeof setTimeout> | null = null

  // the scrollable content box that clips — the popup must stay inside its bounds
  function scrollBox(): HTMLElement | null {
    return (listEl?.closest('.content.scrollable') as HTMLElement) ?? null
  }

  function position(index: number) {
    const row = rowEls[index]
    const box = scrollBox()
    if (!row || !box || !popupEl) return
    const r = row.getBoundingClientRect()
    const b = box.getBoundingClientRect()
    const ph = popupEl.offsetHeight

    // horizontal: align with the TEXT content area, not the box edges. The box
    // has inner padding (left ~3rem next to the separator, right ~1rem) plus the
    // scrollbar gutter, so insetting by the box's own padding keeps the popup off
    // the separator line on the left and off the scrollbar on the right.
    const cs = getComputedStyle(box)
    const padL = parseFloat(cs.paddingLeft) || 0
    const padR = parseFloat(cs.paddingRight) || 0
    const scrollbar = box.offsetWidth - box.clientWidth // gutter width, if any
    const left = b.left + padL
    const width = b.width - padL - padR - scrollbar

    // vertical: prefer below the row; flip above if it would overflow the box
    // bottom; if neither fully fits, clamp within the box.
    const below = r.bottom + GAP
    const above = r.top - GAP - ph
    let top: number
    if (below + ph <= b.bottom - MARGIN) {
      top = below // fits below
    } else if (above >= b.top + MARGIN) {
      top = above // flip above
    } else {
      // doesn't fully fit either way (very tall popup) — clamp inside the box
      top = Math.min(Math.max(below, b.top + MARGIN), b.bottom - ph - MARGIN)
    }

    popupStyle = `left:${left}px; top:${top}px; width:${width}px;`
    positioned = true
  }

  function cancelClose() {
    if (closeTimer) {
      clearTimeout(closeTimer)
      closeTimer = null
    }
  }

  function open(index: number) {
    cancelClose()
    positioned = false // hide until placed (prevents a 0,0 flash on first render)
    hovered = index
    // measure AFTER the popup has rendered + laid out for this project (so
    // offsetHeight is correct) — rAF runs after Svelte flushes the DOM + layout.
    requestAnimationFrame(() => position(index))
  }

  function scheduleClose() {
    // small delay so moving the pointer from the row onto the popup (to click a
    // link) doesn't drop it.
    if (closeTimer) clearTimeout(closeTimer)
    closeTimer = setTimeout(() => {
      hovered = null
      closeTimer = null
    }, 90)
  }

  // Tap/click toggles the popup — this is how TOUCH devices (no hover) open it:
  // tap a row to show its popup, tap again (or tap elsewhere) to dismiss.
  function toggle(index: number) {
    if (hovered === index) {
      cancelClose()
      hovered = null
    } else {
      open(index)
    }
  }

  function onScrollOrResize() {
    if (hovered != null) position(hovered)
  }

  // Tap OUTSIDE a row or the popup dismisses it (touch devices, where there's no
  // mouseleave). A row's own click is handled by toggle() and stops here via the
  // target check.
  function onDocPointerDown(e: PointerEvent) {
    if (hovered == null) return
    const t = e.target as HTMLElement
    if (t.closest?.('.project') || t.closest?.('.popup-layer')) return
    cancelClose()
    hovered = null
  }

  onMount(() => {
    // The content box scrolls internally (overflow-y:auto); its scroll events
    // don't bubble to window, so listen in the CAPTURE phase to re-track the
    // popup while the list scrolls. Also re-track on viewport resize.
    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)
    document.addEventListener('pointerdown', onDocPointerDown)
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('resize', onScrollOrResize)
      document.removeEventListener('pointerdown', onDocPointerDown)
    }
  })

  const current = $derived(hovered != null ? projects[hovered] : null)
</script>

<Slide title="Projects" scrollable>
  <ul class="list" bind:this={listEl}>
    {#each projects as project, i}
      <!-- each row reveals the shared popup on hover/focus; the popup itself is
           rendered once below as a fixed layer so it can't be clipped. -->
      <li class="project" class:active={hovered === i}>
        <span
          class="row"
          role="button"
          tabindex="0"
          bind:this={rowEls[i]}
          onmouseenter={() => open(i)}
          onmouseleave={scheduleClose}
          onfocusin={() => open(i)}
          onfocusout={scheduleClose}
          onclick={() => toggle(i)}
          onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggle(i))}
        >
          <span class="name">{project.name}</span>
          {#if project.ongoing}<span class="ongoing">(ongoing)</span>{/if}
          <span class="tech">
            {#each project.tech as t}
              {@const icon = techIcons[t]}
              <!-- a project may override a badge's label (e.g. Archery's single
                   Cloudflare badge carries the merged Cloudflare + Turnstile text) -->
              {@const label = project.techLabels?.[t] ?? icon.label}
              <span class="badge" title={label} aria-label={label}>
                <!-- size="100%" → the SVG fills the fixed square badge box, which is
                     what actually centres every icon uniformly (see .badge styles) -->
                <icon.component size="100%" />
              </span>
            {/each}
          </span>
        </span>
      </li>
    {/each}
  </ul>
</Slide>

<!-- the single fixed popup layer: positioned in JS so it's always fully visible
     (flips above/below the row, clamped inside the scroll box) and never clipped.
     Kept open while the pointer is over it so the Live/Code links are clickable. -->
{#if current}
  <div
    class="popup-layer"
    class:positioned
    style={popupStyle}
    bind:this={popupEl}
    onmouseenter={cancelClose}
    onmouseleave={scheduleClose}
    role="tooltip"
  >
    <ProjectPopup summary={current.summary} liveUrl={current.liveUrl} repoUrl={current.repoUrl} />
  </div>
{/if}

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
    font-size: 1.4rem; // matches Skills/About (shared standard)
    font-weight: 300;
    line-height: 1.2;
    width: 100%;
  }

  // the visible row content (name + ongoing + badges) — packs to the left.
  .row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer; // pointer cursor when hovering a project option
    width: fit-content; // hover the content, not the full-width empty remainder
    color: var(--color-ink);
    transition: color 0.15s ease;
    outline: none; // focus is signalled by the gold highlight + popup, not a ring
  }

  // Highlight the hovered/active row gold so it's clear which project's info is
  // shown. The text inherits `color`; the badge SVGs use currentColor, so setting
  // the row colour turns the icons gold too (and we lift them to full opacity).
  .project.active .row,
  .row:hover,
  .row:focus-visible {
    color: var(--color-gold);

    .badge {
      color: var(--color-gold);
      opacity: 1;
    }
  }

  // The fixed popup layer — escapes the scroll box's overflow clipping entirely.
  // position/size are set inline from JS; this just establishes the fixed layer
  // and a fade-in.
  .popup-layer {
    position: fixed;
    z-index: 50;
    // hidden until JS computes its position (prevents a flash at 0,0)
    opacity: 0;
    visibility: hidden;
  }
  .popup-layer.positioned {
    visibility: visible;
    animation: popup-in 0.15s ease forwards;
  }
  @keyframes popup-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
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
    transition:
      color 0.15s ease,
      opacity 0.15s ease;

    // the SVG fills its box and is block-level so it centres to the box (not the
    // text baseline), removing the baseline drop inline SVGs otherwise have.
    :global(svg) {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  // MOBILE (≤768px): now the content is FULL-WIDTH (horizontal split), so each
  // project is ONE horizontal row — name then its badges on a single line. If a
  // long badge list overflows, that row scrolls SIDEWAYS (no wrapping into many
  // rows, which was the visual clutter). Body ~16px.
  @media (max-width: 768px) {
    .project {
      font-size: 1rem; // ~16px body
    }
    .row {
      flex-wrap: nowrap; // keep name + badges on one line
      width: 100%;
      max-width: 100%;
      overflow-x: auto; // overflowing badges scroll sideways instead of wrapping
      overflow-y: hidden;
      scrollbar-width: none; // hide the row's own scrollbar (Firefox)
      &::-webkit-scrollbar {
        display: none; // hide it (WebKit)
      }
    }
    .name {
      white-space: nowrap; // don't let the name wrap mid-row
      flex: 0 0 auto;
    }
    .tech {
      flex: 0 0 auto; // badges keep their size; the row scrolls if needed
      flex-wrap: nowrap;
    }
    .badge {
      --badge-size: 1.05em;
    }
  }
</style>
