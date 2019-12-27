<script>
  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import Route from './Route.svelte'
  import init from './navigator.js'

  export let routes

  let layouts, route
  const { updatePage, click } = init(
    routes,
    update => ({ layouts, route } = update)
  )
  updatePage()

  setContext('routifyupdatepage', updatePage)

  // svelte:window events doesn't work on refresh
  ;['pushstate', 'popstate', 'replacestate'].forEach(e =>
    addEventListener(e, () => updatePage())
  )
  addEventListener('click', click)
</script>

<Route {layouts} />
