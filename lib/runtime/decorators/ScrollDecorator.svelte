<script context="module">
    import { get } from 'svelte/store'
    import { scrollToContext, persistentScopedScrollIntoView } from '../helpers/scroll.js'
    const hashScroll = route => {
        setTimeout(async () => {
            const hashElem = globalThis.document?.getElementById(route?.hash)
            hashElem['routify-hash-nav'] = 'true'
            await persistentScopedScrollIntoView(hashElem, null, {}, 500)
            delete hashElem['routify-hash-nav']
        }, 0)
    }
</script>

<script>
    /** @type {RenderContext} */
    export let context
    $: ({ route, isActive } = context)
    $: if (route?.hash) hashScroll(route)
    else if (get(isActive) && !route?.state.dontScroll) scrollToContext(context)
</script>

<slot />
