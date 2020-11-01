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
   * @prop {HTMLElement} parentNode
   * */

  import '../typedef.js'
  import { getContext, setContext, onDestroy, onMount, tick } from 'svelte'
  import { writable, get } from 'svelte/store'
  import { metatags, afterPageLoad } from './helpers.js'
  import { route, routes, rootContext } from './store'
  import { handleScroll } from './utils'
  import { onPageLoaded } from './utils/onPageLoaded.js'

  /** @type {LayoutOrDecorator[]} */
  export let layouts = []
  export let scoped = {}
  export let Decorator = null
  export let childOfDecorator = false
  export let isRoot = false

  let scopedSync = {}
  let isDecorator = false


  /** @type {LayoutOrDecorator} */
  let layout = null

  /** @type {LayoutOrDecorator[]} */
  let remainingLayouts = []

  const context = writable(null)

  /** @type {import("svelte/store").Writable<Context>} */
  const parentContextStore = getContext('routify')

  /** @type {Node | Context} */
  let mole = $parentContextStore

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

  /** @param {SvelteComponent} componentFile */
  function onComponentLoaded(componentFile) {
    /** @type {Context} */
    const parentContext = get(parentContextStore)

    scopedSync = { ...scoped }
    if (remainingLayouts.length === 0) onLastComponentLoaded()
    const ctx = {
      layout: isDecorator ? parentContext.layout : layout,
      component: layout,
      route: $route,
      componentFile,
      parentNode: mole.parentNode,
      child: isDecorator
        ? parentContext.child
        : get(context) && get(context).child,
    }
    context.set(ctx)
    if (isRoot) rootContext.set(ctx)

    if (parentContext && !isDecorator)
      parentContextStore.update((store) => {
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
    await tick()
    handleScroll(mole.parentNode)

    const isOnCurrentRoute = $context.component.path === $route.path //maybe we're getting redirected

    // Let everyone know the last child has rendered
    if (!window['routify'].stopAutoReady && isOnCurrentRoute) {
      onPageLoaded({ page: $context.component, metatags, afterPageLoad })
    }
  }

  /**  @param {ClientNode} layout */
  function getID({ meta, path, param, params }) {
    return JSON.stringify({
      path,
      param: (meta['param-is-page'] || meta['slug-is-page']) && param,
      queryParams: meta['query-params-is-page'] && params,
    })
  }
</script>

{#if $context}
  {#if $context.component.isLayout === false}
    {#each [$context] as { component, componentFile } (getID(component))}
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
<span bind:this={mole} />
