<script>
  import { getContext, setContext, onDestroy, onMount } from 'svelte'
  import { writable } from 'svelte/store'
  import { _url, _goto, _isActive } from './helpers.js'
  import { route } from './store'
  import { handleScroll } from './utils'

  export let layouts = [],
    scoped = {},
    Decorator,
    _passthroughDecorator
  let scopeToChild,
    props = {},
    parentElement,
    propFromParam = {},
    key = 0

  const context = writable({})
  setContext('routify', context)

  $: if (Decorator) {
    layouts = [
      { component: () => Decorator, path: layouts[0].path + '__decorator' },
      ...layouts,
    ]
  }

  $: [layout, ...remainingLayouts] = layouts
  $: if (layout && layout.param) propFromParam = layout.param
  $: layoutIsUpdated = !_lastLayout || _lastLayout.path !== layout.path
  
  function setParent(el) {
    parentElement = el.parentElement
  }

  let _lastLayout, _Component
  function onComponentReady() {
    _lastLayout = layout
    if (layoutIsUpdated) key++
    if (remainingLayouts.length === 0) onFinishedLoadingPage()
    context.set({
      route: $route,
      path: layout.path,
      url: _url(layout, $route),
      goto: _goto(layout, $route),
      isActive: _isActive(layout, $route),
    })
  }

  let component
  function setComponent(layout) {
    if (layoutIsUpdated) _Component = layout.component()
    if (_Component.then)
      _Component.then(res => {
        component = res
        onComponentReady()
      })
    else {
      component = _Component
      onComponentReady()
    }
  }
  $: setComponent(layout)

  function onFinishedLoadingPage() {
    const firstPage = window.routify != 'ready'
    if (firstPage) {
      // Let every know the last child has rendered
      window.routify = 'ready'
      dispatchEvent(new CustomEvent('app-loaded'))
    }
  }
</script>

{#if component}
  {#each [0] as dummy (key)}
    <svelte:component
      this={component}
      let:scoped={scopeToChild}
      let:decorator
      {scoped}
      {...propFromParam}>
      {#if remainingLayouts.length}
        <svelte:self
          layouts={[...remainingLayouts]}
          Decorator={typeof decorator !== 'undefined' ? decorator : _passthroughDecorator}
          _passthroughDecorator={Decorator}
          scoped={{ ...scoped, ...scopeToChild }} />
      {/if}
    </svelte:component>
  {/each}
{/if}

<!-- get the parent element for scroll functionality -->
{#if !parentElement}
  <span use:setParent />
{/if}
