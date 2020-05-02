<script>
  // @ts-check
  /** @typedef {{component():*, path: string}} Decorator */
  /** @typedef {ClientNode | Decorator} LayoutOrDecorator */
  /**
   * @typedef {Object} Context
   * @prop {ClientNode} layout
   * @prop {ClientNode} component
   * @prop {LayoutOrDecorator} child
   * @prop {SvelteComponent} ComponentFile
   * */

  import '../typedef.js'
  import { getContext, setContext, onDestroy, onMount, tick } from 'svelte'
  import { writable, get } from 'svelte/store'
  import { metatags, afterPageLoad } from './helpers.js'
  import { route, routes } from './store'
  import { handleScroll } from './utils'

  /** @type {LayoutOrDecorator[]} */
  export let layouts = []
  export let scoped = {}
  export let Decorator = null
  export let childOfDecorator = false

  let scopedSync = {}
  let layoutIsUpdated = false
  let isDecorator = false

  /** @type {HTMLElement} */
  let parentElement

  /** @type {LayoutOrDecorator} */
  let layout = null

  /** @type {LayoutOrDecorator} */
  let lastLayout = null

  /** @type {LayoutOrDecorator[]} */
  let remainingLayouts = []

  const context = writable(null)

  /** @type {import("svelte/store").Writable<Context>} */
  const parentContextStore = getContext('routify')


  isDecorator = Decorator && !childOfDecorator
  setContext('routify', context)

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

  /** @param {SvelteComponent} componentFile */
  function onComponentLoaded(componentFile) {
    /** @type {Context} */
    const parentContext = get(parentContextStore)

    scopedSync = { ...scoped }
    lastLayout = layout
    if (remainingLayouts.length === 0) onLastComponentLoaded()
    context.set({
      layout: isDecorator ? parentContext.layout : layout,
      component: layout,
      componentFile,
      child: isDecorator
        ? parentContext.child
        : get(context) && get(context).child,
    })

    if (parentContext && !isDecorator)
      parentContextStore.update(store => {
        store.child = layout || store.child
        return store
      })
  }

  /**  @param {LayoutOrDecorator} layout */
  function setComponent(layout) {
    let PendingComponent = layout.component()
    if (PendingComponent instanceof Promise)
      PendingComponent.then(onComponentLoaded)
    else onComponentLoaded(PendingComponent)
  }
  $: setComponent(layout)

  async function onLastComponentLoaded() {
    afterPageLoad._hooks.forEach(hook => hook(layout.api))    
    await tick()
    handleScroll(parentElement)
    metatags.update()
    if (!window['routify'].appLoaded) onAppLoaded()
  }

  async function onAppLoaded() {
    const pagePath = $context.component.path
    const routePath = $route.path
    const isOnCurrentRoute = pagePath === routePath //maybe we're getting redirected

    // Let everyone know the last child has rendered
    if (!window['routify'].stopAutoReady && isOnCurrentRoute) {
      dispatchEvent(new CustomEvent('app-loaded'))
      window['routify'].appLoaded = true
    }
  }
</script>

{#if $context}
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
