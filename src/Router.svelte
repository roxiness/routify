<script>
  import {url} from './utils'
  import Route from "./Route.svelte";
  import init from "./navigator.js";
  import { routes } from "generatedRoutes.js";
  export let scoped

  let components, route;
  init(routes, update => ({ components, route } = update));
</script>

<Route {components} {route} {routes} {url} rootScope={scoped} />
