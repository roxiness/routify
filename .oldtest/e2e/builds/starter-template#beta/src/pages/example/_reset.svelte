<script>
  import { url } from "@sveltech/routify";
  import NavLinks from "./_components/NavLinks.svelte";
  import RenderStatus from "./_components/RenderStatus.svelte";
</script>

<style>
  .example {
    background-color: #ffeffe;
    background-attachment: fixed;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  * :global(.card) {
    border-radius: 0.25rem;
    border-width: 1px;
    border: 1px solid #e2e8f0;
    margin-bottom: 3rem;
    padding: 2rem;
    background: white;
  }

  * :global(.shadow) {
    box-shadow: 0px 5px 20px 5px rgba(0, 0, 0, 0.075);
  }

  .nav {position: fixed; left: 0; right: 0;}
  .main {overflow: auto; height: calc(100% - 100px); padding-top: 100px}
</style>

<!-- Reset files doesn't inherit the parent scope.
This ensures that the example app doesn't inherit
 layouts from the main app. -->
<div class="example">
  <div class="nav">
    <NavLinks />
    <RenderStatus />
  </div>
  <div class="main">
    <slot>
      <!-- optional fallback -->
    </slot>
  </div>
</div>
