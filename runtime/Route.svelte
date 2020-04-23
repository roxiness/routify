<script>
  // @ts-check
  /** @typedef {import('../typedef').ClientNode} ClientNode */
  /** @typedef {{component():*, path: string}} Decorator */
  /** @typedef {ClientNode | Decorator} LayoutOrDecorator */
  import { getContext, setContext, onDestroy, onMount, tick } from 'svelte'
  import { writable, get } from 'svelte/store'
  import { metatags } from './helpers.js'
  import { route, routes } from './store'
  import { handleScroll } from './utils'

  /** @type {LayoutOrDecorator[]} */
  export let layouts = []
  export let scoped = {}
  export let Decorator = null
  export let childOfDecorator = false

  let scopedSync = {}
  let layoutIsUpdated = false

  /** @type {HTMLElement} */
  let parentElement

  /** @type {LayoutOrDecorator} */
  let layout = null

  /** @type {LayoutOrDecorator} */
  let lastLayout = null

  /** @type {LayoutOrDecorator[]} */
  let remainingLayouts = []

  const context = writable({})
  const parentContext = getContext('routify')
  setContext('routify', context)

  $: isDecorator = Decorator && !childOfDecorator

  $: if (isDecorator) {
    const decoratorLayout = {
      component: () => Decorator,
      path: `${layouts[0].path}__decorator`,
      isDecorator: true,
    }
    layouts = [decoratorLayout, ...layouts]
  }

  $: [layout, ...remainingLayouts] = layouts
  $: layoutIsUpdated = !lastLayout || lastLayout.path !== layout.path

  /** @param {HTMLElement} el */
  function setParent(el) {
    parentElement = el.parentElement
  }

  function onComponentLoaded(componentFile) {
    scopedSync = { ...scoped }
    lastLayout = layout
    if (remainingLayouts.length === 0) onLastComponentLoaded()
    context.set({
      layout: isDecorator ? get(parentContext).layout : layout,
      component: layout,
      componentFile
    })
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
  {:else if remainingLayouts.length}
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
          childOfDecorator={layout.isDecorator}
          scoped={{ ...scoped, ...scopeToChild }} />
      </svelte:component>
    {/each}
  {/if}
{/if}

<!-- get the parent element for scroll functionality -->
{#if !parentElement}
  <span use:setParent />
{/if}
