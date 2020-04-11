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

  $: oldRoute = $route.last || $route
  $: [concestor, ancestor, oldAncestor] = getConcestor($route, oldRoute)
  $: toAncestor = isAncestor(oldRoute, $route)
  $: toDescendant = isAncestor($route, oldRoute)
  $: toHigherIndex = ancestor && ancestor.meta.index > oldAncestor.meta.index
  $: toLowerIndex = ancestor && ancestor.meta.index < oldAncestor.meta.index


  $: meta = {
    toAncestor,
    toDescendant,
    toHigherIndex,
    toLowerIndex,
    routes: [$route, oldRoute],
    ancestors: [ancestor, oldAncestor],
  }

  $: _config = configs.find(({ condition }) => condition(meta)) || config || defaultConfig
  $: normalizedConfig = { ...defaultConfig, ..._config }
  $: ({ transition, inParams, outParams } = normalizedConfig)

  function isAncestor(descendant, ancestor) {
    if(descendant.parent === ancestor.parent) return false
    const { shortPath } = descendant.parent
    const { shortPath: shortPath2 } = ancestor.parent
    
    return ancestor.isIndex && shortPath !== shortPath2 && shortPath.startsWith(shortPath2)
  }

  function setAbsolute({ target }) {
    target.style.position = 'absolute'
  }
</script>

<style>
  .transition {
    height: 100%;
    width: 100%;
  }
</style>

<div
  class="transition"
  in:transition|local={inParams}
  out:transition|local={outParams}
  on:outrostart={setAbsolute}>
  <slot />
</div>
