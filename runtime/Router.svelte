<script>
  import {url} from './utils'
  import Route from "./Route.svelte";
  import init from "./navigator.js";
  import { options as _routeOptions, routes as defaultRoutes } from "../tmp/routes.js";
  export let routes

  routes = routes || defaultRoutes

  let components, route;
  init(routes, update => ({ components, route } = update));
</script>

<Route {components} {route} {routes} {_routeOptions} {url} rootScope={{}} />
