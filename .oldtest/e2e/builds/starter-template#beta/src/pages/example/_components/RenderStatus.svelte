<script>
  import { fade } from "svelte/transition";
  import { route } from "@sveltech/routify";

  let show = false;
  let render;
  $: moved = !!$route.prev;
  [...document.getElementsByTagName("meta")].forEach(elem => {
    render = elem.dataset.render || render;
  });

  $: lastRender = moved ? "dynamic" : render || "spa";
  $: lastRender &&
    (show = true) &&
    setTimeout(() => {
      show = false;
    }, 3000);
</script>

<style>
  .box {
    position: fixed;
    bottom: 20px;
    left: 20px;
    padding: 8px 16px;
    background: white;
    border-radius: 4px;
    font-weight: bold;
    color: #777;
  }
</style>

{#if show}
  <div transition:fade|local class="box">source: {lastRender}</div>
{/if}
