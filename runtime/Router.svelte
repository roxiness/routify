<script>
    import Component from './Component.svelte'
    import Debugger from './Debugger.svelte'
    export let instance

    const isDescendantElem = parent => elem => {
        while ((elem = elem.parentNode)) if (elem === parent) return true
        return false
    }

    const initialize = elem => {
        addEventListener('click', event => {
            if (isDescendantElem(elem)(event.target)) handleClick(event)
        })
    }

    function handleClick(event) {
        const el = event.target.closest('a')
        const href = el && el.href

        if (
            event.ctrlKey ||
            event.metaKey ||
            event.altKey ||
            event.shiftKey ||
            event.button ||
            event.defaultPrevented
        )
            return
        if (!href || el.target || el.host !== location.host) return

        const url = new URL(href)
        const relativeUrl = url.pathname + url.search + url.hash

        event.preventDefault()
        instance.urlStore.set(relativeUrl)
    }

    console.log(instance)
</script>

<h1>Router.svelte</h1>
<div style="display: contents" use:initialize>
    <Debugger {instance}>
        <Component />
    </Debugger>
</div>

<a href="#outside-1">outside-link 1</a>
<a href="#outside-2">outside-link 2</a>
