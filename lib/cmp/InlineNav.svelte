<script>
    import { Router, createRouter, context } from '@roxi/routify'
    import { InternalReflector } from '@roxi/routify/lib/runtime/Router/urlReflectors/Internal'

    const { route, node } = $context
    const { activeRoute } = route.router

    /** @returns {Router['constructor']} */
    const createRouterCmp = options => {
        return function (opts) {
            opts.props = opts.props || {}
            opts.props.router = options.router
            return new Router(opts)
        }
    }

    const pages = $context.node.pages.map(n => ({
        rootNode: n,
        url: '/',
        router: createRouter({
            beforeRender: fragments =>
                fragments.slice(
                    fragments.findIndex(fragment => fragment.node.level > node.level),
                ),
            passthrough: true,
            urlReflector: InternalReflector,
            url: n.path,
        }),
    }))

    $: updateRouters($activeRoute)

    const updateRouters = activeRoute => {
        pages
            .filter(p => activeRoute.allFragments.map(ar => ar.node).includes(p.rootNode))
            .forEach(p => {
                p.router.activeRoute.set(activeRoute)
            })
    }
</script>

<slot pages={pages.map(page => ({ Page: createRouterCmp({ router: page.router }) }))} />
