<script>
  import { setContext } from "svelte";
  import { url } from "./utils";
  import Route from "./Route.svelte";
  import init from "./navigator.js";
  import { routes as defaultRoutes } from "../tmp/routes.js";
  export let routes;

  routes = routes || defaultRoutes;

  setContext("routify", {
    routes,
    component: false
  });

  let layouts, route;
  init(routes, update => ({ layouts, route } = update));
</script>

<Route {layouts} />
