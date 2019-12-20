<script>
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

  // doesn't workin svelte:window (only gets called in navigation and not on refresh)
  addEventListener('routifyupdatepage', ({ detail }) => {
    updatePage(detail.url, detail.shallow)
  })
</script>

<Route {layouts} />

<svelte:window  
  on:pushstate={() => updatePage()}
  on:popstate={() => updatePage()}
  on:replacestate={() => updatePage()}
  on:click={click} />
