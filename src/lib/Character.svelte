<script lang="ts">
  // A small stick-figure built from basic shapes (circle head, triangle body,
  // line limbs + a line gun). Each part has a class so GSAP can animate it
  // (jump out, idle, aim, shoot-recoil) later. Drawn in a 100x140 viewBox.
  // Colours inherit the site ink via currentColor.
</script>

<svg
  class="character"
  viewBox="0 -10 110 150"
  fill="none"
  stroke="currentColor"
  stroke-width="4"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <!-- head + hat grouped so they turn together (look around) about the neck -->
  <g class="ch-headgroup">
    <!-- head — sits right on top of the body triangle (no neck gap) -->
    <circle class="ch-head" cx="50" cy="26" r="14" fill="currentColor" stroke="none" />

    <!-- triangle hat slung on the BACK (upper-left) of the head — the character
         faces right, so the hat sitting back-left reads as 'facing right'. -->
    <polygon class="ch-hat" points="27,19 49,25 39,5" fill="currentColor" stroke="none" />
  </g>

  <!-- body: triangle (wide base at the hips, point up at the neck) -->
  <polygon class="ch-body" points="50,36 34,86 66,86" fill="currentColor" stroke="none" />

  <!-- legs -->
  <line class="ch-leg ch-leg-l" x1="44" y1="86" x2="36" y2="120" />
  <line class="ch-leg ch-leg-r" x1="56" y1="86" x2="64" y2="120" />

  <!-- left arm hangs down at rest; a group so it can raise to pull the top bar
       down. Pivots at the left shoulder (46,46). The wand is handed over to this
       arm later (a second wand here, revealed when the right one is hidden). -->
  <g class="ch-leftarm">
    <line class="ch-arm ch-arm-l" x1="46" y1="46" x2="26" y2="78" />
    <g class="ch-wand-left">
      <line x1="26" y1="78" x2="14" y2="100" stroke-width="2.5" />
      <!-- 5-point star centred on the wand tip (14,100) -->
      <path
        d="M14 94 L15.6 98.4 L20.4 98.6 L16.6 101.6 L18 106.2 L14 103.4 L10 106.2 L11.4 101.6 L7.6 98.6 L12.4 98.4 Z"
        fill="currentColor"
        stroke="none"
      />
    </g>
  </g>

  <!-- RIGHT arm + wand as one group, pivoting at the shoulder (54,46). At rest
       the arm hangs down (group not rotated). To "draw + point up" the group
       rotates up about the shoulder and the wand fades in, ending pointing up. -->
  <g class="ch-rightarm">
    <line class="ch-arm ch-arm-r" x1="54" y1="46" x2="74" y2="78" />
    <!-- wand held at the right hand (74,78), continuing along the arm's line so
         that when the arm raises, the wand points up. Hidden until drawn. -->
    <g class="ch-wand">
      <line x1="74" y1="78" x2="86" y2="100" stroke-width="2.5" />
      <path
        d="M86 100 L88.6 103 L92.4 101.6 L90.4 105 L92.4 108.4 L88.6 107 L86 110 L85 106 L81 105.4 L84.6 103.6 Z"
        fill="currentColor"
        stroke="none"
      />
    </g>
  </g>
</svg>

<style lang="scss">
  .character {
    width: 80px;
    height: 112px;
    color: var(--color-ink);
    display: block;
    overflow: visible; // let the raised wand/star extend past the viewBox
  }

  // hat rotated 180° about its own centre
  .ch-hat {
    transform-box: fill-box;
    transform-origin: center;
    transform: rotate(180deg);
  }

  // wands hidden until drawn / handed over later in the sequence
  .ch-wand,
  .ch-wand-left {
    visibility: hidden;
  }

  // legs swing about the hip (their top point) for the walk cycle
  .ch-leg {
    transform-box: fill-box;
    transform-origin: top;
  }

</style>
