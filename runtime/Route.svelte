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
    lastLayout
  const context = writable({})
  setContext('routify', context)

  if (typeof Decorator === 'undefined')
    Decorator = getContext('routify-decorator')
  setContext('routify-decorator', Decorator)

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
    if (lastLayout !== layout) {
      const _component = await layout.component()
      component = !Decorator
        ? _component
        : function(options = {}) {
            return new Wrapper({
              ...options,
              props: {
                ...options.props,
                Decorator,
                Component: _component,
              },
            })
          }
      lastLayout = layout
    }
    updateContext(layout)
  }
</script>

{#if component}
  <svelte:component
    this={component}
    let:scoped={scopeToChild}
    let:decorator
    {scoped}
    {...layout.param}>
    {#if remainingLayouts.length}
      <svelte:self
        layouts={remainingLayouts}
        Decorator={decorator}
        scoped={{ ...scoped, ...scopeToChild }} />
    {/if}
  </svelte:component>
{/if}

<!-- get the parent element for scroll functionality -->
{#if !parentElement}
  <span use:setParent />
{/if}
