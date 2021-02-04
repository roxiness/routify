<script>
  import { getConcestor, isAncestor } from '../helpers'
  import { fade } from 'svelte/transition'
  import { get } from 'svelte/store'
  import { route, node } from '../'
  export let configs = []
  export let config = false
  export let SiblingIndexIsAncestor = false

  const defaultConfig = {
    transition: fade,
    inParams: {},
    outParams: {},
  }

  $: oldRoute = $route.last || $route
  $: [concestor, ancestor, oldAncestor] = getConcestor($route.api, oldRoute.api)
  $: toAncestor = isAncestor($route, oldRoute, SiblingIndexIsAncestor)
  $: toDescendant = isAncestor(oldRoute, $route, SiblingIndexIsAncestor)
  $: toHigherIndex = ancestor && ancestor.meta.index > oldAncestor.meta.index
  $: toLowerIndex = ancestor && ancestor.meta.index < oldAncestor.meta.index

  $: meta = {
    toAncestor,
    toDescendant,
    toHigherIndex,
    toLowerIndex,
    routes: [$route, oldRoute],
    pages: [$route.api, oldRoute.api],
    ancestors: [ancestor, oldAncestor],
  }

  $: _config =
    configs.find(({ condition }) => condition(meta)) || config || defaultConfig
  $: normalizedConfig = { ...defaultConfig, ..._config }
  $: ({ transition, inParams, outParams } = normalizedConfig)

  function setAbsolute({ target }) {
    const rect = target.getBoundingClientRect()
    target.style.width = `${rect.width}px`
    target.style.height = `${rect.height}px`
    target.style.top = `${rect.top}px`
    target.style.left = `${rect.left}px`
    target.style.position = 'fixed'
  }
  function removeAbsolute({ target }) {
    target.style.position = ''
    target.style.width = ''
    target.style.height = ''
    target.style.transform = ''
  }
</script>

<div
  class="transition node{get(node).__file.id}"
  in:transition|local={inParams}
  out:transition|local={outParams}
  on:introstart={removeAbsolute}
  on:outrostart={setAbsolute}
>
  <slot />
</div>

<style>
  .transition {
    height: 100%;
    width: 100%;
  }
</style>
