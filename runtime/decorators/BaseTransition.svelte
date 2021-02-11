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

  function setFixed({ target }) {
    const rect = target.getBoundingClientRect()
    target.style.position = 'fixed'
    target.style.width = `${rect.width}px`
    target.style.height = `${rect.height}px`
    target.style.top = `${rect.top}px`
    target.style.left = `${rect.left}px`
  }
  function undoFixed({ target }) {
    target.style.position = null
    target.style.width = null
    target.style.height = null
    target.style.top = null
    target.style.left = null
  }

  let parentElementOverflow = null
  function setHidden({ target }) {
    if (parentElementOverflow === null)
      parentElementOverflow = target.parentElement.style.overflow
    target.parentElement.style.overflow = 'hidden'
  }
  function undoHidden({ target }) {
    target.parentElement.style.overflow = parentElementOverflow
  }
</script>

<div
  class="transition node{get(node).__file.id}"
  in:transition|local={inParams}
  out:transition|local={outParams}
  on:introstart={(t) => {
    undoFixed(t)
    setHidden(t)
  }}
  on:introend={undoHidden}
  on:outrostart={setFixed}
>
  <slot />
</div>

<style>
  .transition {
    height: 100%;
    width: 100%;
  }
</style>
