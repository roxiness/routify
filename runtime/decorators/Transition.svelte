<script>
  import { getConcestor } from '../helpers'
  import { fade } from 'svelte/transition'
  import { route } from '../'
  export let configs = []
  export let config = false

  const defaultConfig = {
    transition: fade,
    inParams: {},
    outParams: {},
  }

  $: oldRoute = $route.prev || $route
  $: [concestor, ancestor, oldAncestor] = getConcestor($route, oldRoute)

  $: meta = {
    route: $route,
    path: $route.path,
    shortPath: $route.shortPath,
    index: $route.meta.index,
    ancestor,
    index: ancestor && ancestor.meta.index,
    oldRoute,
    oldPath: oldRoute.path,
    oldIndex: oldAncestor && oldAncestor.meta.index,
    oldShortPath:  oldRoute.shortPath,
    oldAncestor,
  }

  $: _config = configs.find(({ condition }) => condition(meta)) || config || {}
  $: normalizedConfig = { ...defaultConfig, ..._config }
  $: ({ transition, inParams, outParams } = normalizedConfig)

  function setAbsolute({ target }) {
    target.style.position = 'absolute'
    target.style.width = '100%'
  }
</script>

<div
  in:transition|local={inParams}
  out:transition|local={outParams}
  on:outrostart={setAbsolute}>
  <slot />
</div>
