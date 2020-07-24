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
  import { route, routes, rootContext } from './store'
  import { handleScroll } from './utils'
  import { onAppLoaded } from './utils/onAppLoaded.js'

  /** @type {LayoutOrDecorator[]} */
  export let layouts = []
  export let scoped = {}
  export let Decorator = null
  export let childOfDecorator = false
  export let isRoot = false

  let scopedSync = {}
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
    const ctx = {
      layout: isDecorator ? parentContext.layout : layout,
      component: layout,
      route: $route,
      componentFile,
      child: isDecorator
        ? parentContext.child
        : get(context) && get(context).child,
    }
    context.set(ctx)
    if (isRoot) rootContext.set(ctx)

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
    if (!window['routify'].appLoaded) {
      const pagePath = $context.component.path
      const routePath = $route.path
      const isOnCurrentRoute = pagePath === routePath //maybe we're getting redirected

      // Let everyone know the last child has rendered
      if (!window['routify'].stopAutoReady && isOnCurrentRoute) {
        onAppLoaded({ path: pagePath, metatags })
      }
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
