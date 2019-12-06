<script>
  import { setContext } from "svelte"
  import Route from "./Route.svelte"
  import init from "./navigator.js"

  export let routes

  setContext("routify", {
    routes,
    component: false,
  })

  let layouts, route
  init(routes, update => ({ layouts, route } = update))
</script>

<Route {layouts} />
