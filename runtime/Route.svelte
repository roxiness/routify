<script>
  import { setContext } from 'svelte'
  import * as internals from 'svelte/internal'
  import { writable } from 'svelte/store'
  import { _url, _goto, _isActive } from './helpers.js'
  import { route } from './store'
  import { handleScroll } from './utils'

  export let layouts = [],
    scoped = {}
  let scopeToChild,
    props = {},
    parentElement,
    component
  const context = writable({})
  setContext('routify', context)

  $: [layout, ...remainingLayouts] = layouts
  $: setComponent(layout)
  $: if (!remainingLayouts.length) handleScroll(parentElement)

  function setParent(el) {
    parentElement = el.parentElement
  }

  function updateContext(layout) {
    context.set({
      route: $route,
      path: layout.path,
      url: _url(layout, $route),
      goto: _goto(layout, $route),
      isActive: _isActive(layout, $route),
    })
  }

  async function setComponent(layout) {
    // We want component and context to be synchronized
    component = await layout.component()
    updateContext(layout)
  }
</script>

{#if component}
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
{/if}

<!-- get the parent element for scroll functionality -->
{#if !parentElement}
  <span use:setParent />
{/if}
