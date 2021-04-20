<script>
    import Wrapper from './Wrapper.svelte'
    import { getUrlFromClick, isDescendantElem } from './utils'
    export let instance

    const initialize = elem => {
        instance.element = elem
        addEventListener('click', handleClick)
        addEventListener('keydown', handleClick)
    }

    const handleClick = event => {
        const url = getUrlFromClick(instance.element)(event)
        if (url) instance.urlStore.set(url)
    }

    console.log(instance)
</script>

<div style="display: contents" use:initialize>
    <Wrapper {instance} />
</div>
