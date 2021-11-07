<script>
    import { Router } from './Router.js'
    import { onDestroy } from 'svelte'

    import { RoutifyRuntime } from '../Instance/RoutifyRuntime.js'
    import { getUrlFromClick } from '../utils/index.js'
    import Component from './Component.svelte'
    export let urlReflector = null
    /** @type {RoutifyRuntime} */
    export let instance = null
    export let urlRewrite = null
    export let url = null
    export let name = ''
    /** @type {Router} */
    export let router = null
    export let routes = null
    export let decorator = null
    export let rootNode = null
    export let passthrough = false

    $: {
        const options = {
            instance,
            rootNode,
            name,
            routes,
            urlRewrite,
            urlReflector,
            passthrough,
        }

        // todo move everything to init
        if (!router) router = new Router(options)
        else router.init(options)
    }
    $: if (url && url !== router.url.internal()) router.url.replace(url)
    $: activeRoute = router.activeRoute
    $: fragments = $activeRoute && router.beforeRender.run($activeRoute.fragments || [])

    $: router.log.debug('before render', fragments) // ROUTIFY-DEV-ONLY

    const initialize = elem => {
        if (!router.passthrough) {
            elem.addEventListener('click', handleClick)
            elem.addEventListener('keydown', handleClick)
        }
    }

    const handleClick = event => {
        const url = getUrlFromClick(event)
        if (url) router.url.push(url)
    }

    if (typeof window !== 'undefined') onDestroy(() => router.destroy())
</script>

{#if $activeRoute}
    <div style="display: contents" use:initialize>
        <Component {fragments} {decorator} />
    </div>
{/if}

{#if !router.parentElem}
    <div use:router.setParentElem />
{/if}
