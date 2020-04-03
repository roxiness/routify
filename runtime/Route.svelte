<script>
  import { getContext, setContext, onDestroy, onMount, tick } from 'svelte'
  import { writable } from 'svelte/store'
  import { metatags } from './helpers.js'
  import { route, routes } from './store'
  import { handleScroll } from './utils'

  export let layouts = [],
    scoped = {},
    Decorator = undefined,
    childOfDecorator = false
  let scopeToChild,
    parentElement,
    scopedSync = {},
    isDecorator = false,
    _lastLayout
    

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
  $: layoutIsUpdated = !_lastLayout || _lastLayout.path !== layout.path

  function setParent(el) {
    parentElement = el.parentElement
  }

  function onComponentLoaded(componentFile) {
    scopedSync = { ...scoped }
    _lastLayout = layout
    if (remainingLayouts.length === 0) onLastComponentLoaded()
    context.set({ component: layout, componentFile })
  }

  function setComponent(layout) {
    const PendingComponent = layout.component()
    if (PendingComponent.then) PendingComponent.then(onComponentLoaded)
    else onComponentLoaded(PendingComponent)
  }
  $: setComponent(layout)

  async function onLastComponentLoaded() {
    await tick()
    handleScroll(parentElement)
    metatags.update()
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

{#if $context.componentFile}
  {#if $context.component.isLayout === false}
    {#each [$context] as { component, componentFile } (component.path)}
      <svelte:component
        this={componentFile}
        let:scoped={scopeToChild}
        let:decorator
        {scoped}
        {scopedSync}
        {...layout.param || {}} />
    {/each}
    <!-- we need to check for remaining layouts, in case this component is a destroyed layout -->
  {:else if (remainingLayouts.length)}   
    {#each [$context] as { component, componentFile } (component.path)}
      <svelte:component
        this={componentFile}
        let:scoped={scopeToChild}
        let:decorator
        {scoped}
        {scopedSync}
        {...layout.param || {}}>
        <svelte:self
          layouts={[...remainingLayouts]}
          Decorator={typeof decorator !== 'undefined' ? decorator : Decorator}
          childOfDecorator={isDecorator}
          scoped={{ ...scoped, ...scopeToChild }} />
      </svelte:component>
    {/each}
  {/if}
{/if}

<!-- get the parent element for scroll functionality -->
{#if !parentElement}
  <span use:setParent />
{/if}
