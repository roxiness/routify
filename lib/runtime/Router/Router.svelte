<script>
    import Component from './Component.svelte'
    import { getUrlFromClick } from '../utils.js'
    import { Router } from './Router.js'
    import { getContext, onDestroy } from 'svelte'
    import { AddressReflector } from './urlReflectors/Address.js'
    import { InternalReflector } from './urlReflectors/Internal.js'
    import { RoutifyRuntime } from '../Instance/RoutifyRuntime.js'
    export let instance = null
    export let urlReflector =
        typeof window != 'undefined' ? AddressReflector : InternalReflector
    export let offset = null
    export let url = null
    export let name = ''
    export let router = null
    export let routes = null
    export let decorator = null

    const parentCmpCtx = getContext('routify-fragment-context')
    if (!instance)
        instance = routes
            ? new RoutifyRuntime({ routes, debugger: false })
            : parentCmpCtx?.route.router.instance || null

    if (!router) router = new Router(instance, { parentCmpCtx, name })

    $: if (offset) router.offset = offset
    $: if (url) router.url.replace(url)
    $: if (urlReflector) router.urlReflector = urlReflector

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
