<script>
  import {url} from './utils';
  import Route from "./Route.svelte";
  import update from "./navigator.js";
  import { routes as defaultRoutes, options as defaultOptions } from "../dist/routes.js";
  
  export let routes = defaultRoutes;
  export let options = defaultOptions;
  export let scope = {};

  let extras = {};

  $: ({
    routes = routes || defaultRoutes,
    options = options || defaultOptions,
    scope = scope,
    ...extras
  } = $$props);

  $: options = { ...(defaultOptions || {}), ...(options || {}) };
  $: scope = { ...(scope || {}), ...(extras || {}) };
  $: router = update({ routes, options, scope });
  
  let route, components;

  function onUpdate(router) {
    ({ route } = router);
    components = [ ...route.layouts, route.component ];
  }

  $: if (router) router.subscribe(onUpdate);
</script>

<Route {routes} _routeOptions={options} rootScope={scope} {components} {route} {url}  />
