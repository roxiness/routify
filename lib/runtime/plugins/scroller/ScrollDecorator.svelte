<script>
    import { get } from 'svelte/store'
    import { scrollQueue } from './ScrollQueue.js'
    import { getLineage } from '../../renderer/utils/index.js'

    /** @type {RenderContext} */
    export let context
    export let isRoot
    isRoot

    const routeHasHashAndWeAreAtTheLeaf = route =>
        route.sourceUrl.hash && route.leaf === context.fragment

    const contextLineageIsActive = () =>
        getLineage(context).every(ctx => get(ctx.isActive))

    const contextWasActive = () =>
        context.parentContext?.lastActiveChildContext === context ||
        (context.node.isRoot && context.route.prevRoute)

    $: ({ route } = context)
    $: if (
        route &&
        !route.state.dontScroll &&
        (routeHasHashAndWeAreAtTheLeaf(route) ||
            (contextLineageIsActive() && !contextWasActive()))
    ) {
        const { debug } = context.router.log // ROUTIFY-DEV-ONLY
        debug('scrollQueue.push', context.node.id || 'unnamed', context) // ROUTIFY-DEV-ONLY
        scrollQueue.push(context)
    }
</script>

<slot />
