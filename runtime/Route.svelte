<script>
  import { setContext, getContext } from 'svelte'
  import * as internals from 'svelte/internal'
  import { demandObject, suppressWarnings } from './scripts.js'
  import { writable } from 'svelte/store'
  import { _url, _goto } from './helpers.js'

  export let layouts = [],
    scoped = {}
  let scopeToChild
  let _context

  const props = {}

  $: [layout, ...remainingLayouts] = layouts

  $: if (layout.params) props.params = layout.params

  $: layout && updateContext()

  function updateContext() {
    const { path, params } = layout
    _context = _context || writable({})

    _context.set({
      path,
      params,
      url: _url(layout),
      goto: _goto(layout),
    })

    setContext('routify', _context)
  }
</script>

<svelte:component
  this={layout.component()}
  let:scoped={scopeToChild}
  {scoped}
  {...props}>
  {#if remainingLayouts.length}
    <svelte:self
      layouts={remainingLayouts}
      scoped={{ ...scoped, ...scopeToChild }} />
  {/if}
</svelte:component>
