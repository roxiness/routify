<script>
  import { writable } from 'svelte/store'
  import Route from './Route.svelte'
  import init from './navigator.js'

  export let routes

  let layouts, route
  init(routes, update => ({ layouts, route } = update))
</script>

<Route {layouts} />
