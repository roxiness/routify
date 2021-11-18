<script>
    /** @typedef {import('./Router').RouterOptions} RouterOptions */

    import { Router } from './Router.js'
    import { onDestroy as _onDestroy } from 'svelte'
    import { getUrlFromClick } from '../utils/index.js'
    import Component from './Component.svelte'

    /** @type {Router} */
    export let router = null
    export let routes = null
    export let decorator = null

    /** @type {RouterOptions['urlReflector']} */
    export let urlReflector = null
    /** @type {RouterOptions['instance']} */
    export let instance = null
    /** @type {RouterOptions['urlRewrite']} */
    export let urlRewrite = null
    /** @type {RouterOptions['url']} */
    export let url = null
    /** @type {RouterOptions['name']} */
    export let name = null
    /** @type {RouterOptions['rootNode']} */
    export let rootNode = null
    /** @type {RouterOptions['passthrough']} */
    export let passthrough = null
    /** @type {RouterOptions['beforeRouterInit']} */
    export let beforeRouterInit = null
    /** @type {RouterOptions['afterRouterInit']} */
    export let afterRouterInit = null
    /** @type {RouterOptions['beforeUrlChange']} */
    export let beforeUrlChange = null
    /** @type {RouterOptions['afterUrlChange']} */
    export let afterUrlChange = null
    /** @type {RouterOptions['transformFragments']} */
    export let transformFragments = null
    /** @type {RouterOptions['onDestroy']} */
    export let onDestroy = null
    /** @type {RouterOptions['plugins']} */
    export let plugins = null

    $: {
        /** @type {import('./Router').RouterOptions}*/
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
