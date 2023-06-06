<script context="module">
    import { get } from 'svelte/store'
    import { scrollToContext, persistentScopedScrollIntoView } from '../helpers/scroll.js'
    const hashScroll = route => {
        setTimeout(async () => {
            const hashElem = globalThis.document?.getElementById(route?.hash)
            if (hashElem) {
                hashElem['routify-hash-nav'] = 'true'
                await persistentScopedScrollIntoView(hashElem, null, {}, 500)
                delete hashElem['routify-hash-nav']
            }
        }, 0)
    }
</script>

<script>
    /** @type {RenderContext} */
    export let context
    export let isRoot

    function allParentsAreActive(context) {
        while (context.parentContext) {
            if (!get(context.isActive)) return false
            context = context.parentContext
        }
        return true
    }

    let wasActive = false

    $: ({ route, isActive } = context)
    $: if (route && !route?.state.dontScroll) {
        if (route.hash) {
            hashScroll(route)
        } else if ($isActive !== wasActive || route.leaf.node === context.node) {
            wasActive = $isActive
            if ($isActive && allParentsAreActive(context)) scrollToContext(context)
        }
    }
</script>

<slot />
