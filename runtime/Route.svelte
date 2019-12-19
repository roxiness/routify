<script>
  import { setContext, getContext } from 'svelte'
  import * as internals from 'svelte/internal'
  import { demandObject, suppressWarnings } from './scripts.js'
  import { writable } from 'svelte/store'
  import { _url, _goto, _isActive } from './helpers.js'
  import { route } from './store'

  export let layouts = [],
    scoped = {}
  let scopeToChild
  let _context

  let props = {}

  $: [layout, ...remainingLayouts] = layouts

  $: updateContext(layout, $route)

  function updateContext(layout, route) {    
    const { path, params } = layout
    _context = _context || writable({})
    _context.set({
      route,
      path,
      params,
      url: _url(layout, route),
      goto: _goto(layout, route),
      isActive: _isActive(layout, route)
    })

    setContext('routify', _context)
  }
</script>

<svelte:component
  this={layout.component()}
  let:scoped={scopeToChild}
  {scoped}
  {...layout.params}>
  {#if remainingLayouts.length}
    <svelte:self
      layouts={remainingLayouts}
      scoped={{ ...scoped, ...scopeToChild }} />
  {/if}
</svelte:component>
