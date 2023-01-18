<script context="module">
    import { get } from 'svelte/store'
    import { scrollToContext, persistentScopedScrollIntoView } from '../helpers/scroll.js'

    const handleContext = context => {
        const { isActive, route, node, router } = context
        if (get(isActive) && !context.route?.state.dontScroll && !route.hash) {
            scrollToContext(context)
        } else if (node === route?.leaf.node && route?.hash) {
            setTimeout(async () => {
                const hashElem = globalThis.document?.getElementById(route?.hash)
                hashElem['routify-hash-nav'] = 'true'
                await persistentScopedScrollIntoView(hashElem, null, {}, 500)
                delete hashElem['routify-hash-nav']
            }, 0)
        }
    }
</script>

<script>
    /** @type {RenderContext} */
    export let context

    $: if (context.route) handleContext(context)
</script>

<slot />
