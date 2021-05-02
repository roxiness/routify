<script>
    import Subroute from './Subroute.svelte'
    import { getUrlFromClick } from './utils'
    import { Router } from './Router.js'
    import { getContext } from 'svelte'
    import { writable } from 'svelte/store'
    export let instance
    export let activeUrl
    export let offset

    const parentCmpCtx = getContext('routify-component')
    instance = instance || parentCmpCtx.route.router.instance

    const router = new Router(instance, { activeUrl, offset, parentCmpCtx })

    const initialize = elem => {
        elem.addEventListener('click', handleClick)
        elem.addEventListener('keydown', handleClick)
    }

    const handleClick = event => {
        const url = getUrlFromClick(event)
        if (url) router.activeUrl.set(url)
    }
</script>

<div style="display: contents" use:initialize>
    <Subroute {router} />
</div>
