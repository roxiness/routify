<script>
    import Subroute from './Subroute.svelte'
    import { getUrlFromClick } from './utils'
    import { Router } from './Router.js'
    import { getContext } from 'svelte'
    import { AddressReflector } from './urlReflectors/Address.js'
    export let instance = null
    export let urlReflector = AddressReflector
    export let offset = null
    export let url = null

    const parentCmpCtx = getContext('routify-component')
    instance = instance || parentCmpCtx.route.router.instance

    const router = new Router(instance, { parentCmpCtx })
    $: router.urlReflector = urlReflector
    $: router.offset = offset
    $: router.url = url

    const initialize = elem => {
        elem.addEventListener('click', handleClick)
        elem.addEventListener('keydown', handleClick)
    }

    const handleClick = event => {
        const url = getUrlFromClick(event)
        if (url) router.activeUrl.push(url, 'internal')
    }
</script>

<div style="display: contents" use:initialize>
    <Subroute {router} />
</div>
