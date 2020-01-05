<script>
  import { setContext } from 'svelte'
  import * as internals from 'svelte/internal'
  import { demandObject, suppressWarnings } from './scripts.js'
  import { writable } from 'svelte/store'
  import { _url, _goto, _isActive } from './helpers.js'
  import { route } from './store'
  import { scrollAncestorsToTop } from './utils'

  export let layouts = [],
    scoped = {}
  let scopeToChild
  let _context
  let props = {}
  let parentElement

  $: [layout, ...remainingLayouts] = layouts

  $: updateContext(layout)

  function setParent(el) {
    parentElement = el.parentElement
  }

  $: if (!remainingLayouts.length && parentElement)
    scrollAncestorsToTop(parentElement)

  function updateContext(layout) {
    _context = _context || writable({})
    _context.set({
      route: $route,
      path: layout.path,
      url: _url(layout, $route),
      goto: _goto(layout, $route),
      isActive: _isActive(layout, $route),
    })

    setContext('routify', _context)
  }
</script>

{#await layout.component() then component}
  <svelte:component
    this={component}
    let:scoped={scopeToChild}
    {scoped}
    {...layout.param}>
    {#if remainingLayouts.length}
      <svelte:self
        layouts={remainingLayouts}
        scoped={{ ...scoped, ...scopeToChild }} />
    {/if}
  </svelte:component>
{/await}

<!-- get the parent element for scroll functionality -->
{#if !parentElement}
  <span use:setParent />
{/if}
