<script>
    import { Router } from './Router.js'
    import { onDestroy as _onDestroy } from 'svelte'
    import { getUrlFromClick, resolveIfAnonFn } from '../utils/index.js'
    import Component from '../renderer/ComposeFragments.svelte'
    import ScrollDecorator from '../decorators/ScrollDecorator.svelte'
    import { get, writable } from 'svelte/store'
    import AnchorDecorator from '../decorators/AnchorDecorator.svelte'
    import { normalizeDecorator } from '../renderer/utils/normalizeDecorator.js'

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
    /** @type {import('../decorators/AnchorDecorator').Location}*/
    export let anchor = 'wrapper'
    /** @type {ClickHandler}*/
    export let clickHandler = {}

    const context = {
        childFragments: writable([]),
        decorators: [normalizeDecorator(ScrollDecorator)],
    }

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
        clickHandler,
    }

    // todo move everything to init
    if (!router) router = new Router(options)

    $: if (url && url !== router.url.internal()) router.url.replace(url)
    $: activeRoute = router.activeRoute
    $: context.childFragments.set($activeRoute?.fragments || [])

    $: router.log.debug('before render', get(context.childFragments)) // ROUTIFY-DEV-ONLY

    /** @param {HTMLElement} elem */
    const initialize = elem => {
        elem = anchor === 'parent' || anchor === 'wrapper' ? elem : elem.parentElement
        router.setParentElem(elem)

        // todo check that a router hasn't already been added to this element
        elem['__routify_meta'] = { ...elem['__routify_meta'], router: router }

        let clickScopeElem = resolveIfAnonFn(clickHandler?.elem || elem)(elem)

        // passthrough should be handled by clickHandler.callback instead?
        if (!router.passthrough) {
            clickScopeElem.addEventListener('click', handleClick)
            clickScopeElem.addEventListener('keydown', handleClick)
        }
    }

    const handleClick = event => {
        /** @type {string|false}*/
        let url = getUrlFromClick(event)
        url = clickHandler.callback?.(event, url) ?? url
        if (typeof url === 'string') router.url.push(url)
    }

    if (typeof window !== 'undefined') _onDestroy(() => router.destroy())
</script>

<AnchorDecorator onMount={initialize} style="display: contents" location={anchor}>
    {#if $activeRoute}
        <Component {context} options={{ decorator }} />
    {/if}
</AnchorDecorator>
