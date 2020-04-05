<script>
  import { setContext, onDestroy } from 'svelte'
  import Route from './Route.svelte'
  import { init } from './navigator.js'
  import { route, routes as routesStore } from './store.js'
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

  let initTimeout = null

  // init is async to prevent a horrible bug that completely disable reactivity
  // in the host component -- something like the component's update function is
  // called before its fragment is created, and since the component is then seen
  // as already dirty, it is never scheduled for update again, and remains dirty
  // forever... I failed to isolate the precise conditions for the bug, but the
  // faulty update is triggered by a change in the route store, and so offseting
  // store initialization by one tick gives the host component some time to
  // create its fragment. The root cause it probably a bug in Svelte with deeply
  // intertwinned store and reactivity.
  const doInit = () => {
    clearTimeout(initTimeout)
    initTimeout = setTimeout(() => {
      cleanup()
      navigator = init(routes, callback)
      routesStore.set(routes)
      navigator.updatePage()
    })
  }

  $: if (routes) doInit()

  onDestroy(cleanup)
</script>

{#if layouts && $route !== null}
  <Route {layouts} />
{/if}
