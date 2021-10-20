<script>
    import { Router } from './Router.js'
    import { onDestroy } from 'svelte'
    import { AddressReflector } from './urlReflectors/Address.js'
    import { InternalReflector } from './urlReflectors/Internal.js'
    import { RoutifyRuntime } from '../Instance/RoutifyRuntime.js'
    import { getUrlFromClick } from '../utils/index.js'
    import Component from './Component.svelte'
    /** @type {RoutifyRuntime} */
    export let instance = null
    export let urlReflector =
        typeof window != 'undefined' ? AddressReflector : InternalReflector
    export let urlRewrite = null
    export let url = null
    export let name = ''
    /** @type {Router} */
    export let router = null
    export let routes = null
    export let decorator = null
    export let rootNode = null

    $: {
        const options = { instance, rootNode, name, routes, urlRewrite }
        // todo move everything to init
        if (!router) router = new Router(options)
        else router.init(options)

        // todo merge with above options?
        // this line starts the router
        if (urlReflector) router.setUrlReflector(urlReflector)
    }

    $: if (url && url !== router.url.internal()) router.url.replace(url)
    $: activeRoute = router.activeRoute

    const initialize = elem => {
        elem.addEventListener('click', handleClick)
        elem.addEventListener('keydown', handleClick)
    }

    const handleClick = event => {
        const url = getUrlFromClick(event)
        if (url) router.url.push(url)
    }

    if (typeof window !== 'undefined') onDestroy(() => router.destroy())
</script>

{#if $activeRoute}
    <div style="display: contents" use:initialize>
        <Component fragments={$activeRoute.fragments} {decorator} />
    </div>
{/if}

{#if !router.parentElem}
    <div use:router.setParentElem />
{/if}
