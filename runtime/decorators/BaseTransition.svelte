<script>
  import { getConcestor, isAncestor, context } from '../helpers'
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

  const { parentNode } = $context
  parentNode.style.display = 'grid'
  parentNode.style['grid-template-rows'] = '1fr'
  parentNode.style['grid-template-columns'] = '1fr'
</script>

<div
  class="transition node{get(node).__file.id}"
  in:transition|local={inParams}
  out:transition|local={outParams}
>
  <slot />
</div>

<style>
  .transition {
    grid-row: 1;
    grid-column: 1;
  }
</style>
