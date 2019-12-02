<script>
  import * as utils from './utils'
  import Route from "./Route.svelte";
  import init from "./navigator.js";
  export let routes
  export let options

  const url = (path, params) => utils.url(path, params, routes);

  let components, route;
  init(routes, update => ({ components, route } = update));
</script>

<Route {components} {route} {routes} _routeOptions={options} {url} rootScope={{}} />
