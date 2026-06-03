<script lang="ts">
  import Shell from './lib/Shell.svelte'
  // Slides come on the feat/slides branch; for now a placeholder fills the slot.
</script>

<Shell>
  <div class="placeholder">
    <h1>Welcome</h1>
    <p>To a place where projects of passion reside</p>
  </div>
</Shell>

<style lang="scss">
  .placeholder {
    h1 {
      font-size: 4rem;
      font-weight: 300;
      margin: 0;
    }

    p {
      margin: 0.5rem 0 0;
      opacity: 0.8;
    }
  }
</style>
