<script lang="ts">
  // Inline SVG sprite: defines reusable <symbol>s referenced elsewhere via
  // <svg><use href="#id" /></svg>. Mounted once near the app root.
  // Source SVGs supplied by the user (svgrepo).
</script>

<svg width="0" height="0" class="sprite" aria-hidden="true">
  <symbol fill="none" viewBox="0 0 20 20" id="icon-plus">
    <path
      fill="currentColor"
      fill-rule="evenodd"
      d="M9 17a1 1 0 102 0v-6h6a1 1 0 100-2h-6V3a1 1 0 10-2 0v6H3a1 1 0 000 2h6v6z"
    />
  </symbol>

  <symbol
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    viewBox="0 0 24 24"
    id="icon-cursor"
  >
    <path d="M4 4l7.07 17 2.51-7.39L21 11.07z" />
  </symbol>

  <symbol fill="none" viewBox="0 0 24 24" id="icon-location">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12.2848 18.9935C12.1567 19.0875 12.0373 19.1728 11.9282 19.2493C11.8118 19.1721 11.6827 19.0833 11.5427 18.9832C10.8826 18.5109 10.0265 17.8176 9.18338 16.9529C7.45402 15.1792 6 12.9151 6 10.5C6 7.18629 8.68629 4.5 12 4.5C15.3137 4.5 18 7.18629 18 10.5C18 12.8892 16.4819 15.1468 14.6893 16.9393C13.8196 17.8091 12.9444 18.5099 12.2848 18.9935ZM19.5 10.5C19.5 16.5 12 21 12 21C11.625 21 4.5 16.5 4.5 10.5C4.5 6.35786 7.85786 3 12 3C16.1421 3 19.5 6.35786 19.5 10.5ZM13.5 10.5C13.5 11.3284 12.8284 12 12 12C11.1716 12 10.5 11.3284 10.5 10.5C10.5 9.67157 11.1716 9 12 9C12.8284 9 13.5 9.67157 13.5 10.5ZM15 10.5C15 12.1569 13.6569 13.5 12 13.5C10.3431 13.5 9 12.1569 9 10.5C9 8.84315 10.3431 7.5 12 7.5C13.6569 7.5 15 8.84315 15 10.5Z"
      fill="currentColor"
    />
  </symbol>
</svg>

<style>
  .sprite {
    position: absolute;
  }
</style>
