<script>
  import Route from "./Route.svelte";
  import init from "./navigator.js";
  export let routes;

  let componentsAndRoute = { components: [], route: {} };
  init(routes, update => (componentsAndRoute = update));
</script>

<Route {...componentsAndRoute} />
