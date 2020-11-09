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
  import { getContext, setContext, tick } from 'svelte'
  import { writable, get } from 'svelte/store'
  import { metatags, afterPageLoad } from './helpers.js'
  import { route, rootContext } from './store'
  import { handleScroll } from './utils'
  import { onPageLoaded } from './utils/onPageLoaded.js'

  /** @type {LayoutOrDecorator[]} */
  export let nodes = []
  export let scoped = {}
  export let Decorator = null
  export let childOfDecorator = false
  export let isRoot = false

  let scopedSync = {}
  let isDecorator = false

  /** @type {LayoutOrDecorator} */
  let node = null

  /** @type {LayoutOrDecorator[]} */
  let remainingNodes = []

  const context = writable(null)

  /** @type {import("svelte/store").Writable<Context>} */
  const parentContextStore = getContext('routify')
  $: parentContext = $parentContextStore

  let parentNode
  const setparentNode = (el) => (parentNode = el.parentNode)

  isDecorator = Decorator && !childOfDecorator
  setContext('routify', context)

  $: if (isDecorator) {
    const decoratorLayout = {
      component: () => Decorator,
      path: `${nodes[0].path}__decorator`,
      isDecorator: true,
    }
    nodes = [decoratorLayout, ...nodes]
  }

  $: [node, ...remainingNodes] = nodes

  /** @param {SvelteComponent} componentFile */
  function onComponentLoaded(componentFile) {
    /** @type {Context} */

    scopedSync = { ...scoped }
    if (remainingNodes.length === 0) onLastComponentLoaded()
    const ctx = {
      layout:
        (node.isLayout && node) || (parentContext && parentContext.layout),
      component: node,
      route: $route,
      componentFile,
      parentNode: parentNode || (parentContext && parentContext.parentNode)
    }
    context.set(ctx)
    if (isRoot) rootContext.set(ctx)
  }

  /**  @param {LayoutOrDecorator} node */
  function setComponent(node) {
    let PendingComponent = node.component()
    if (PendingComponent instanceof Promise)
      PendingComponent.then(onComponentLoaded)
    else onComponentLoaded(PendingComponent)
  }
  $: setComponent(node)

  async function onLastComponentLoaded() {
    await tick()
    handleScroll(parentNode)

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
        {...node.param || {}} />
    {/each}
    <!-- we need to check for remaining nodes, in case this component is a destroyed layout -->
  {:else if remainingNodes.length}
    {#each [$context] as { component, componentFile } (component.path)}
      <svelte:component
        this={componentFile}
        let:scoped={scopeToChild}
        let:decorator
        {scoped}
        {scopedSync}
        {...node.param || {}}>
        <svelte:self
          nodes={[...remainingNodes]}
          Decorator={typeof decorator !== 'undefined' ? decorator : Decorator}
          childOfDecorator={node.isDecorator}
          scoped={{ ...scoped, ...scopeToChild }} />
      </svelte:component>
    {/each}
  {/if}
{/if}

<!-- get the parent element for scroll and transitions -->
<span use:setparentNode />
