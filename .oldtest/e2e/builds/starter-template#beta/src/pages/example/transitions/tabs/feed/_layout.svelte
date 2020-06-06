<style>
  main {
    background: #0bf5cc;
    height: 100%;
    overflow-y: auto;
  }
  * :global(.card) {
    background: white;
    width: 256px;
    height: 256px;
    display: inline-block;
    box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    margin: 24px;
  }
</style>

<!-- routify:options index=1 -->
<main>
  <slot />
</main>
