<script>
    import '../../../typedef.js'
    import Component from './Component.svelte'
    import { getUrlFromClick } from '../utils/index.js'
    import { Router } from './Router.js'
    import { getContext, onDestroy } from 'svelte'
    import { AddressReflector } from './urlReflectors/Address.js'
    import { InternalReflector } from './urlReflectors/Internal.js'
    import { RoutifyRuntime } from '../Instance/RoutifyRuntime.js'
    import { globalInstance } from '../Global/Global.js'
    /** @type {RoutifyRuntime} */
    export let instance = null
    export let urlReflector =
        typeof window != 'undefined' ? AddressReflector : InternalReflector
    export let url = null
    export let name = ''
    export let router = null
    export let routes = null
    export let decorator = null
    export let rootNode = null

    const parentCmpCtx = getContext('routify-fragment-context')
    if (!instance)
        instance =
            parentCmpCtx?.route.router.instance ||
            globalInstance.instances[0] ||
            new RoutifyRuntime({})

    if (routes) instance.superNode.importTree(routes)

    if (!router) router = new Router(instance, { rootNode, parentCmpCtx, name })

    $: if (url && url !== router.url.get()) router.url.replace(url)

    $: if (urlReflector) router.urlReflector = urlReflector

    $: activeRoute = router.activeRoute

    const setParentElem = elem => (router.parentElem = elem.parentElement)

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
    <div use:setParentElem />
{/if}
