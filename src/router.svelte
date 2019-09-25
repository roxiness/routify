<script>
  import Route from "./route.svelte";
  import init from "./history.js";
  export let routes;

  let componentsAndRoute = { components: [], route: {} };
  init(routes, update => (componentsAndRoute = update));
</script>

<style>
  h1 {
    color: purple;
  }
</style>

<h1>Router</h1>

{#each routes.filter(p => !p.isLayout) as route}
  <a href={route.path.replace(/[\[\]]+/g, '')}>
    <div>{route.path}</div>
  </a>
{/each}
<!-- {JSON.stringify(components)} -->
<Route {...componentsAndRoute} />
