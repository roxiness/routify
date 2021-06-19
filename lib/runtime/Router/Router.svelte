<script>
    import Subroute from './Subroute.svelte'
    import { getUrlFromClick } from '../utils.js'
    import { Router } from './Router.js'
    import { getContext, onDestroy } from 'svelte'
    import { AddressReflector } from './urlReflectors/Address.js'
    import Noop from '../decorators/Noop.svelte'
    import { RoutifyRuntime } from '../Instance/RoutifyRuntime.js'
    export let instance = null
    export let urlReflector = AddressReflector
    export let offset = null
    export let url = null
    export let name = ''
    export let router = null
    export let routes = null
    export let decorator = Noop

    const parentCmpCtx = getContext('routify-component')
    instance =
        instance ||
        (routes
            ? new RoutifyRuntime({ routes, debugger: false })
            : parentCmpCtx.route.router.instance)

    router = new Router(instance, { parentCmpCtx, name })
    $: router.urlReflector = urlReflector
    $: router.offset = offset
    $: if (url) router.url.replace(url)

    const initialize = elem => {
        elem.addEventListener('click', handleClick)
        elem.addEventListener('keydown', handleClick)
    }

    const handleClick = event => {
        const url = getUrlFromClick(event)
        if (url) router.url.push(url)
    }

    onDestroy(() => router.destroy())
</script>

<div style="display: contents" use:initialize>
    <svelte:component this={decorator} {router}>
        <Subroute {router} />
    </svelte:component>
</div>
