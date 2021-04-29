<script>
    import Subroute from './Subroute.svelte'
    import { getUrlFromClick } from './utils'
    import { setContext } from 'svelte'
    export let instance

    const initialize = elem => {
        instance.element = elem
        addEventListener('click', handleClick)
        addEventListener('keydown', handleClick)
    }

    const handleClick = event => {
        const url = getUrlFromClick(instance.element)(event)
        if (url) instance.activeUrl.set(url)
    }
    const { activeRoute } = instance
</script>

<div style="display: contents" use:initialize>
    <Subroute route={$activeRoute} />
</div>
