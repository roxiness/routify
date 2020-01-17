<script>
  import { getContext, setContext } from 'svelte'
  import * as internals from 'svelte/internal'
  import { writable } from 'svelte/store'
  import { _url, _goto, _isActive } from './helpers.js'
  import { route } from './store'
  import { handleScroll } from './utils'
  import Wrapper from './Wrapper.svelte'

  export let layouts = [],
    scoped = {},
    Decorator = undefined
  let scopeToChild,
    props = {},
    parentElement,
    component,
    lastLayout,
    propFromParam = {}

  const context = writable({})
  setContext('routify', context)

  if (typeof Decorator === 'undefined')
    Decorator = getContext('routify-decorator')
  setContext('routify-decorator', Decorator)

  $: [layout, ...remainingLayouts] = layouts
  $: if (layout) setComponent(layout)
  $: if (!remainingLayouts.length) handleScroll(parentElement)
  $: if (layout && layout.param) propFromParam = layout.param
  
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
    if (lastLayout !== layout) {
      const Component = await layout.component()
      component = !Decorator
        ? Component
        : function(options = {}) {
            return new Wrapper({
              ...options,
              props: {
                ...options.props,
                Decorator,
                Component,
              },
            })
          }
      lastLayout = layout
    }
    updateContext(layout)
    if(remainingLayouts.length === 0) window.status = "ready"
  }
</script>

{#if component}
  <svelte:component
    this={component}
    let:scoped={scopeToChild}
    let:decorator
    {scoped}
    {...propFromParam}>
    <svelte:self
      layouts={[...remainingLayouts]}
      Decorator={decorator}
      scoped={{ ...scoped, ...scopeToChild }} />
  </svelte:component>
{/if}

<!-- get the parent element for scroll functionality -->
{#if !parentElement}
  <span use:setParent />
{/if}
