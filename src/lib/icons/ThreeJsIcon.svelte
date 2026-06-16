<script lang="ts">
  // Three.js tech icon (the official three.js triangle mark). Monochrome via
  // currentColor → follows theme ink (brown in light mode, white in dark mode).
  interface Props {
    size?: number | string
  }
  let { size = 20 }: Props = $props()
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 226 226"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
  role="img"
>
  <path
    fill="currentColor"
    d="M63.0234 17.0234L130.602 213.504L0.480469 53.5234L63.0234 17.0234ZM78.0234 12.0234L154.539 0.480469L225.52 86.2266L78.0234 12.0234ZM166.539 11.0234L218.539 99.5234L148.539 211.523L166.539 11.0234Z"
  />
</svg>
