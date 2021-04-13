<script>
  // @ts-check
  /** @typedef {{component():*, path: string, isLayout: false, param: false}} Decorator */
  /** @typedef {ClientNode | Decorator} LayoutOrDecorator */
  /**
   * @typedef {Object} Context
   * @prop {ClientNode} layout
   * @prop {ClientNode} component
   * @prop {LayoutOrDecorator} child
   * @prop {SvelteComponent} ComponentFile
   * @prop {HTMLElement} parentNode
   * */

  import { suppressComponentWarnings } from './utils'
  import Noop from './decorators/Noop.svelte'
  import '../typedef.js'
  import { getContext, setContext, tick } from 'svelte'
  import { writable } from 'svelte/store'
  import { metatags, afterPageLoad } from './helpers.js'
  import { route, routes, rootContext } from './store'
  import { handleScroll } from './utils'
  import { onPageLoaded } from './utils/onPageLoaded.js'

  /** @type {LayoutOrDecorator[]} */
  export let nodes = []
  export let scoped = {}
  export let decorator = undefined

  /** @type {LayoutOrDecorator} */
  let node = null
  let remainingNodes = null
  let scopedSync = {}
  let parentNode
  let invalidate = 1

  const context = writable(null)
  /** @type {import("svelte/store").Writable<Context>} */
  const parentContext = getContext('routify') || rootContext
  const setParentNode = (el) => parentNode = el.parentNode
  
  setContext('routify', context)

  let lastNodes = []
  $: if (lastNodes !== nodes) {
    lastNodes = nodes
    ;[node, ...remainingNodes] = [...nodes]
    node.api.reset = () => invalidate++
  }

  /**  @param {LayoutOrDecorator} node */
  function setComponent(node) {
    let PendingComponent = node.component()
    if (PendingComponent instanceof Promise)
      PendingComponent.then(onComponentLoaded)
    else onComponentLoaded(PendingComponent)
  }
  $: setComponent(node)

  /** @param {SvelteComponent} componentFile */
  function onComponentLoaded(componentFile) {
    scopedSync = { ...scoped }

    // we have to proxy remaining nodes through ctx (instead of props) or route changes get propagated
    // to leaf layouts of to-be-destroyed-layouts
    const ctx = {
      //we need to keep any possible context.child or the layout will be childless until the new child has been rendered
      ...$context,
      nodes: remainingNodes,
      decorator: decorator || Noop,
      layout: node.isLayout ? node : $parentContext.layout,
      component: node,
      route: $route,
      routes: $routes,
      componentFile,
      parentNode: parentNode || $parentContext.parentNode,
    }
    context.set(ctx)
    $parentContext.child = node
    if (remainingNodes.length === 0) onLastComponentLoaded()
  }

  async function onLastComponentLoaded() {
    await new Promise((resolve) => setTimeout(resolve))
    const isOnCurrentRoute = $context.component.path === $route.path //maybe we're getting redirected

    // Let everyone know the last child has rendered
    if (!window['routify'].stopAutoReady && isOnCurrentRoute)
      onPageLoaded({
        page: $context.component,
        metatags,
        afterPageLoad,
        parentNode,
      })
  }

  /**  @param {ClientNode} layout */
  function getID({ meta, path, param, params }) {
    return JSON.stringify({
      path,
      invalidate,
      param: (meta['param-is-page'] || meta['slug-is-page']) && param,
      queryParams: meta['query-params-is-page'] && params,
    })
  }
  $: id = $context && invalidate && getID($context.component)
  $: $context && suppressComponentWarnings($context, tick)
</script>

{#if $context}
  {#each [$context] as { component, componentFile, decorator, nodes } (id)}
    <svelte:component this={decorator} {scoped}>
      <svelte:component
        this={componentFile}
        let:scoped={scopeToChild}
        let:decorator
        {scoped}
        {scopedSync}
        {...node.param || {}}
      >
        {#if component && nodes.length}
          <svelte:self
            {decorator}
            {nodes}
            scoped={{ ...scoped, ...scopeToChild }}
          />
        {/if}
      </svelte:component>
    </svelte:component>
  {/each}
{/if}
<!-- get the parent element for scroll and transitions -->

{#if !parentNode}
  <div style="display: contents" use:setParentNode />
{/if}