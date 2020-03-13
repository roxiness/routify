<script>
  import { setContext, onDestroy } from 'svelte'
  import Route from './Route.svelte'
  import { init } from './navigator.js'
  import { routes as routesStore } from './store.js'
  import { suppressWarnings } from './utils.js'

  export let routes

  let layouts
  let navigator

  suppressWarnings()

  if (!window.routify) {
    window.routify = {}
  }

  const updatePage = (...args) => navigator && navigator.updatePage(...args)

  setContext('routifyupdatepage', updatePage)

  const callback = res => (layouts = res)

  const cleanup = () => {
    if (!navigator) return
    navigator.destroy()
    navigator = null
  }

  const doInit = () => {
    cleanup()
    navigator = init(routes, callback)
    routesStore.set(routes)
    navigator.updatePage()
  }

  $: if (routes) doInit()

  onDestroy(cleanup)
</script>

{#if layouts}
  <Route {layouts} />
{/if}
