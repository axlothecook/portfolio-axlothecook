<script lang="ts">
  // Theme verification view. The fixed shell + slides come on later branches.
</script>

<main>
  <h1>portfolio-axlothecook</h1>
  <p>Theme: background #ececec, ink #34302d (switchable to #1e1f1c), navbar #d9d9d9.</p>
  <div class="navbar-sample">navbar bg sample (#d9d9d9)</div>
</main>

<style lang="scss">
  main {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .navbar-sample {
    background-color: var(--color-navbar);
    padding: 0.75rem 1.5rem;
    border-radius: 999px;
  }
</style>
