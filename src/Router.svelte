<script>
  import Route from "./Route.svelte";
  import init from "./navigator.js";
  import { routes } from "generatedRoutes.js";

  let components = [];
  let route = {};
  init(routes, update => ({ components, route } = update));
</script>

<Route {components} {route} {routes} />
