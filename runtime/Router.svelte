<script>
  import { setContext, onDestroy } from 'svelte'
  import Route from './Route.svelte'
  import { init } from './navigator.js'
  import { routes as routesStore } from './store.js'
  import { suppressWarnings } from './utils.js'
  import defaultConfig from '../runtime.config'

  export let routes
  export let config = {}

  let layouts
  let navigator

  Object.entries(config).forEach(([key, value]) => {
    defaultConfig[key] = value
  })

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
