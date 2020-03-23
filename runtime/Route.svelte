<script>
  import { getContext, setContext, onDestroy, onMount, tick } from 'svelte'
  import { writable } from 'svelte/store'
  import { meta } from './helpers.js'
  import { route, routes } from './store'
  import { handleScroll } from './utils'

  export let layouts = [],
    scoped = {},
    Decorator = undefined,
    childOfDecorator = false
  let scopeToChild,
    props = {},
    parentElement,
    propFromParam = {},
    key = 0,
    scopedSync = {},
    isDecorator = false

  const context = writable({})
  setContext('routify', context)

  $: if (Decorator && !childOfDecorator) {
    isDecorator = true
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
  function onComponentLoaded() {
    _lastLayout = layout
    if (layoutIsUpdated) key++
    if (remainingLayouts.length === 0) onLastComponentLoaded()
    context.set({ component: layout })
  }

  let component
  function setComponent(layout) {
    if (layoutIsUpdated) _Component = layout.component()
    if (_Component.then)
      _Component.then(res => {
        component = res
        scopedSync = { ...scoped }
        onComponentLoaded()
      })
    else {
      component = _Component
      scopedSync = { ...scoped }
      onComponentLoaded()
    }
  }
  $: setComponent(layout)

  async function onLastComponentLoaded() {
    await tick()
    handleScroll(parentElement)
    meta.update()
    if (!window.routify.appLoaded) onAppLoaded()
  }

  async function onAppLoaded() {
    // Let every know the last child has rendered
    if (!window.routify.stopAutoReady) {
      dispatchEvent(new CustomEvent('app-loaded'))
      window.routify.appLoaded = true
    }
  }
</script>

{#if component}
  {#if remainingLayouts.length}
    {#each [0] as dummy (key)}
      <svelte:component
        this={component}
        let:scoped={scopeToChild}
        let:decorator
        {scoped}
        {scopedSync}
        {...propFromParam}>
        <svelte:self
          layouts={[...remainingLayouts]}
          Decorator={typeof decorator !== 'undefined' ? decorator : Decorator}
          childOfDecorator={isDecorator}
          scoped={{ ...scoped, ...scopeToChild }} />
      </svelte:component>
    {/each}
  {:else}
    <svelte:component
      this={component}
      let:scoped={scopeToChild}
      let:decorator
      {scoped}
      {scopedSync}
      {...propFromParam} />
  {/if}
{/if}

<!-- get the parent element for scroll functionality -->
{#if !parentElement}
  <span use:setParent />
{/if}
