<script>
    import { Router } from './Router.js'
    import { onDestroy as _onDestroy } from 'svelte'
    import { getUrlFromClick } from '../utils/index.js'
    import Component from './Component.svelte'

    /** @type {Router} */
    export let router = null
    export let routes = null
    export let decorator = null

    /** @type {RoutifyRuntimeOptions['urlReflector']} */
    export let urlReflector = null
    /** @type {RoutifyRuntimeOptions['instance']} */
    export let instance = null
    /** @type {RoutifyRuntimeOptions['urlRewrite']} */
    export let urlRewrite = null
    /** @type {RoutifyRuntimeOptions['url']} */
    export let url = null
    /** @type {RoutifyRuntimeOptions['name']} */
    export let name = null
    /** @type {RoutifyRuntimeOptions['rootNode']} */
    export let rootNode = null
    /** @type {RoutifyRuntimeOptions['passthrough']} */
    export let passthrough = null
    /** @type {RoutifyRuntimeOptions['beforeRouterInit']} */
    export let beforeRouterInit = null
    /** @type {RoutifyRuntimeOptions['afterRouterInit']} */
    export let afterRouterInit = null
    /** @type {RoutifyRuntimeOptions['beforeUrlChange']} */
    export let beforeUrlChange = null
    /** @type {RoutifyRuntimeOptions['afterUrlChange']} */
    export let afterUrlChange = null
    /** @type {RoutifyRuntimeOptions['transformFragments']} */
    export let transformFragments = null
    /** @type {RoutifyRuntimeOptions['onDestroy']} */
    export let onDestroy = null
    /** @type {RoutifyRuntimeOptions['plugins']} */
    export let plugins = null
    /** @type {RoutifyRuntimeOptions['queryHandler']} */
    export let queryHandler = null

    $: {
        /** @type {RoutifyRuntimeOptions}*/
        const options = {
            instance,
            rootNode,
            name,
            routes,
            urlRewrite,
            urlReflector,
            passthrough,
            beforeRouterInit,
            afterRouterInit,
            beforeUrlChange,
            afterUrlChange,
            transformFragments,
            onDestroy,
            plugins,
            queryHandler,
        }

        // todo move everything to init
        if (!router) router = new Router(options)
        else router.init(options)
    }
    $: if (url && url !== router.url.internal()) router.url.replace(url)
    $: activeRoute = router.activeRoute
    $: fragments = $activeRoute?.fragments || []

    $: router.log.debug('before render', fragments) // ROUTIFY-DEV-ONLY

    const initialize = elem => {
        if (!router.passthrough) {
            elem.addEventListener('click', handleClick)
            elem.addEventListener('keydown', handleClick)
        }
    }

    const handleClick = event => {
        const url = getUrlFromClick(event)
        if (url) router.url.push(url)
    }

    if (typeof window !== 'undefined') _onDestroy(() => router.destroy())
</script>

{#if $activeRoute}
    <div style="display: contents" use:initialize>
        <Component {fragments} {decorator} />
    </div>
{/if}

{#if !router.parentElem}
    <div use:router.setParentElem />
{/if}
