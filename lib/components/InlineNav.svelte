<script>
    import { Router, createRouter, context } from '@roxi/routify'
    import { InternalReflector } from '@roxi/routify/lib/runtime/Router/urlReflectors/Internal'
    import Nested from './Nested.svelte'
    export let parentNode = null
    export let singlePage = null

    const { route, node } = $context
    const { activeRoute } = route.router

    singlePage = singlePage || typeof window === 'undefined'
    parentNode = parentNode || node

    /**
     * we're going to add the router class to the Router
     * component before we send it back as "page"
     * @returns {Router['constructor']}
     * */
    const createRouterCmp = router => {
        return function (opts) {
            opts.props = { ...opts.props, router }

            return new Router(opts)
        }
    }

    /**
     * before render, we need to strip the components
     * that have already been rendered by the parent router
     * @param fragments
     */
    const beforeRender = fragments => {
        const cutoff = fragments.findIndex(
            fragment => fragment.node.level > parentNode.level,
        )
        return fragments.slice(cutoff)
    }

    const routers = parentNode.pages.map(n => ({
        rootNode: n,
        router: createRouter({
            beforeRender,
            passthrough: true,
            urlReflector: InternalReflector,
            url: n.path,
            name: n.name,
        }),
    }))

    $: activeSubRouter = routers.find(p =>
        $activeRoute.allFragments.map(ar => ar.node).includes(p.rootNode),
    )

    $: activeSubRouter.router.activeRoute.set($activeRoute)

    $: payload = {
        index: singlePage ? 0 : routers.findIndex(r => r === activeSubRouter),
        pages: !singlePage
            ? routers.map(page => ({ Page: createRouterCmp(page.router) }))
            : [{ Page: Nested }],
        inBrowser: !singlePage,
    }

    let id = singlePage
</script>

{#if !singlePage}
    <div style="display: contents">
        <slot {...payload} />
    </div>
{:else}
    <slot {...payload} />
{/if}
