<script lang="ts">
  // The "Animated" mode placeholder. A single full-screen view: a dark backdrop
  // whose colour shifts through animated gradients (classic CSS, no blobs here)
  // with "Coming soon" centred. None of the straightforward-mode UI shows here.
  // (Three.js etc. comes much later — this is just the placeholder.)
</script>

<div class="animated-screen">
  <h1 class="coming-soon">Coming soon</h1>
</div>

<style lang="scss">
  // Full-viewport overlay. Sits above the slides but BELOW the top-bar toggle
  // (z-index 20 in Shell) so the user can switch back.
  .animated-screen {
    position: fixed;
    inset: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: #000;
  }

  // Animated gradient background: a large multi-stop rainbow gradient that pans
  // across, so the backdrop colour keeps changing (classic CSS, GPU-cheap).
  .animated-screen::before {
    content: '';
    position: absolute;
    inset: -50%;
    background: linear-gradient(
      120deg,
      #ff3b3b,
      #ff8a00,
      #ffe600,
      #36d399,
      #00b3ff,
      #6a5cff,
      #c451ff,
      #ff3b8d,
      #ff3b3b
    );
    background-size: 300% 300%;
    // pan the gradient + slowly hue-rotate so EVERY colour passes through
    animation:
      pan 18s ease-in-out infinite,
      hue 24s linear infinite;
    opacity: 0.55; // let it sit over the black base (keeps it moody, text readable)
    filter: blur(40px);
  }

  .coming-soon {
    position: relative;
    z-index: 1;
    margin: 0;
    color: #fff;
    font-size: clamp(2.5rem, 7vw, 6rem);
    font-weight: 600;
    letter-spacing: 0.01em;
    text-align: center;
  }

  @keyframes pan {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  @keyframes hue {
    to {
      filter: blur(40px) hue-rotate(360deg);
    }
  }
</style>
