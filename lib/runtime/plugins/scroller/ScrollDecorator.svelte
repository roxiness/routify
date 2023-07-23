<script>
    import { get } from 'svelte/store'
    import { scrollToContext } from './scroll.js'
    import { getLineage } from '../../renderer/utils/index.js'

    /** @type {RenderContext} */
    export let context
    export let isRoot
    isRoot

    $: ({ route, router } = context)
    $: if (route && !route.state.dontScroll) {
        if (route.hash && route.leaf === context.fragment) {
            scrollToContext(context)
        } else if (
            // The node is the leaf of the active route of the router.
            (get(router.activeRoute).leaf.node === context.node ||
                // the node and its ancestors are all active
                getLineage(context).every(ctx => get(ctx.isActive))) &&
            // don't scroll if the node context was already active
            context !== context.parentContext?.lastActiveChildContext
        )
            scrollToContext(context)
    }
</script>

<slot />
