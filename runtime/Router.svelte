<script>
  import { setContext, onDestroy } from 'svelte'
  import Route from './Route.svelte'
  import { init } from './navigator.js'
  import { routes as routesStore } from './store.js'
  import { suppressWarnings } from './utils.js'

  suppressWarnings()

  if (!window.routify) {
    window.routify = {}
  }

  export let routes
  routesStore.set(routes)
  let layouts = []

  const callback = res => (layouts = res)

  $: ({ updatePage, destroy } = init($routesStore, callback))
  $: updatePage()
  $: setContext('routifyupdatepage', updatePage)

  onDestroy(() => {
    destroy()
  })
</script>

<Route {layouts} />
