<script>
  import { writable } from 'svelte/store'
import { setContext } from 'svelte'
  import Route from './Route.svelte'
  import init from './navigator.js'

  export let routes

  // setContext('routify', writable({
  //   routes,
  //   route: 'Root'
  // }));

  let layouts, route
  init(routes, update => ({ layouts, route } = update))
</script>

<Route {layouts} />
