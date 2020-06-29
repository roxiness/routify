<script>
  import { url, route } from "@sveltech/routify";

  $: match = $route.path.match(/\/modal\/([^\/]+)\//);
  $: active = match && match[1];
</script>

<style>
  * :global(.cards) {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    padding: 0;
  }

  * :global(.card) {
    border-radius: 0.25rem;
    border-width: 1px;
    border: 1px solid #e2e8f0;
    margin-bottom: 3rem;
    padding: 2rem;
    background: white;
    list-style: none;
    width: 25%;
    position: relative;
    cursor: pointer;
  }

  * :global(.container) {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    padding-top: 5rem;
    background: rgba(0, 0, 0, 0.2);
  }

  * :global(.modal) {
    margin: auto;
    background: white;
    font-size: 5rem;
    border: 1px solid #e2e8f0;
    width: 30%;
    padding-top: 3rem;
    padding-bottom: 3rem;
    text-align: center;
  }

  .center {
    text-align: center;
  }
  .active {
    font-weight: bold;
  }
</style>

<div data-routify="scroll-lock">

  <div class="center">
    <a href={$url('./basic')} class={active === 'basic' ? 'active' : ''}>
      Basic
    </a>
    <a href={$url('./animated')} class={active === 'animated' ? 'active' : ''}>
      Animated
    </a>
  </div>

  <br />

  <slot>
    <!-- optional fallback -->
  </slot>
</div>
