<script>
    import { get } from 'svelte/store'
    import { scrollToContext } from './scroll.js'
    import { getLineage } from '../../renderer/utils/index.js'

    /** @type {RenderContext} */
    export let context
    export let isRoot
    isRoot

    const routeHasHashAndWeAreAtTheLeaf = route =>
        route.hash && route.leaf === context.fragment

    const contextLineageIsActive = () =>
        getLineage(context).every(ctx => get(ctx.isActive))

    const contextWasNotActive = () =>
        context !== context.parentContext?.lastActiveChildContext

    $: ({ route } = context)
    $: if (
        route &&
        !route.state.dontScroll &&
        (routeHasHashAndWeAreAtTheLeaf(route) ||
            (contextLineageIsActive() && contextWasNotActive()))
    ) {
        const { debug } = context.router.log // ROUTIFY-DEV-ONLY
        debug('scrolling to context', context.node.id || 'unnamed', context) // ROUTIFY-DEV-ONLY
        scrollToContext(context)
    }
</script>

<slot />
