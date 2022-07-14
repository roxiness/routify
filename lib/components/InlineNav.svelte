<script>
    import { Router, createRouter, context } from '../runtime/index.js'
    import { InternalReflector } from '../runtime/Router/urlReflectors/Internal'
    import { clone } from '../runtime/utils'
    import Nested from './Nested.svelte'
    export let parentNode = null
    export let singlePage = null

    const { route, node } = $context
    const { activeRoute } = route.router
    let payload

    singlePage = singlePage || typeof window === 'undefined'
    parentNode = parentNode || node
    const isActiveNode = node =>
        $activeRoute.allFragments.find(ar => ar.node.id === node.id)
    $: refresh($activeRoute)

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
    const transformFragments = fragments => {
        const cutoff = fragments.findIndex(
            fragment => fragment.node.level > parentNode.level,
        )
        return fragments.slice(cutoff)
    }

    const routers = parentNode.children.map(n => ({
        rootNode: n,
        router: createRouter({
            transformFragments,
            passthrough: true,
            urlReflector: InternalReflector,
            url: n.path,
            name: n.name,
        }),
    }))

    const refresh = $activeRoute => {
        // find the nested router that matches the url
        const activeSubRouter = routers.find(router => isActiveNode(router.rootNode))
        if (!activeSubRouter) console.error('no subrouter is active')
        // set the nested router to use the route of the parent router
        const clonedRoute = clone($activeRoute, { router: activeSubRouter.router })
        activeSubRouter.router.activeRoute.set(clonedRoute)
        setTimeout(() => {
            console.log(document.getElementsByTagName('div'))
            for (const el of document.getElementsByTagName('div')) {
                console.log(el, el.router)
            }
        })

        payload = {
            index: singlePage ? 0 : routers.indexOf(activeSubRouter),
            pages: !singlePage
                ? routers.map(page => ({
                      Page: createRouterCmp(page.router),
                      router: page.router,
                  }))
                : [{ Page: Nested }],
            inBrowser: !singlePage,
        }
    }
</script>

{#if !singlePage}
    <div style="display: contents" wtf>
        <slot {...payload} />
    </div>
{:else}
    <slot {...payload} />
{/if}
