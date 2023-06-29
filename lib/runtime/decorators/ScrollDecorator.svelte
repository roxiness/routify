<script>
    import { get } from 'svelte/store'
    import { scrollToContext } from '../helpers/scroll.js'
    import { getLineage } from '../renderer/utils/index.js'

    /** @type {RenderContext} */
    export let context
    export let isRoot

    let wasActive = false

    $: ({ route, isActive } = context)
    $: if (route && !route.state.dontScroll) {
        if (route.hash) {
            if (route.leaf === context.fragment) {
                scrollToContext(context)
            }
        } else if (
            $isActive !== wasActive ||
            (route.leaf.node === context.node && !wasActive) // if wasActive is true, we already scrolled
        ) {
            wasActive = $isActive

            const lineageIsActive = getLineage(context).every(ctx => get(ctx.isActive))
            if (lineageIsActive) scrollToContext(context)
        }
    }
</script>

<slot />
