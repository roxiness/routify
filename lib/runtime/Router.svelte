<script>
    import Subroute from './Subroute.svelte'
    import { getUrlFromClick } from './utils'
    import { Router } from './Router.js'
    import { setContext } from 'svelte'
    import { writable } from 'svelte/store'
    export let instance
    export let activeUrl = instance.activeUrl

    const router = writable(null)
    setContext('routify-router', router)
    $: $router = new Router(instance, activeUrl)

    const initialize = elem => {
        elem.addEventListener('click', handleClick)
        elem.addEventListener('keydown', handleClick)
    }

    const handleClick = event => {
        const url = getUrlFromClick(event)
        if (url) $router.activeUrl.set(url)
    }
</script>

<div style="display: contents" use:initialize>
    <Subroute {router} />
</div>
