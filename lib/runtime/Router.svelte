<script>
    import Subroute from './Subroute.svelte'
    import { getUrlFromClick } from './utils'
    import { Router } from './Router.js'
    import { getContext } from 'svelte'
    import { AddressReflector } from './urlReflectors/Address.js'
    export let instance
    export let urlReflector = AddressReflector
    export let offset

    const parentCmpCtx = getContext('routify-component')
    instance = instance || parentCmpCtx.route.router.instance

    const router = new Router(instance, parentCmpCtx)
    $: router.urlReflector = urlReflector
    $: router.offset = offset

    const initialize = elem => {
        elem.addEventListener('click', handleClick)
        elem.addEventListener('keydown', handleClick)
    }

    const handleClick = event => {
        const url = getUrlFromClick(event)
        if (url) router.activeUrl.set({ url, mode: 'pushState' })
    }
</script>

<div style="display: contents" use:initialize>
    <Subroute {router} />
</div>
