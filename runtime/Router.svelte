<script>
  import { setContext } from 'svelte'
  import Route from './Route.svelte'
  import { init } from './navigator.js'

  window.routify = {}

  export let routes
  let layouts = []

  const callback = res => (layouts = res)
  const updatePage = init(routes, callback)
  setContext('routifyupdatepage', updatePage)

  updatePage()
</script>

<Route {layouts} />
