<script>
    import { Router, createRouter, context } from '@roxi/routify'
    import { InternalReflector } from '@roxi/routify/lib/runtime/Router/urlReflectors/Internal'
    import Nested from './Nested.svelte'
    export let parentNode = null

    const { route, node } = $context
    const { activeRoute } = route.router

    parentNode = parentNode || node

    /**
     * @returns {Router['constructor']}
     * */
    const createRouterCmp = options => {
        return function (opts) {
            opts.props = opts.props || {}
            opts.props.router = options.router
            return new Router(opts)
        }
    }

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
        }),
    }))

    $: pages =
        typeof window !== 'undefined'
            ? routers.map(page => ({ Page: createRouterCmp({ router: page.router }) }))
            : [{ Page: Nested }]

    $: activeSubRoute = routers.find(p =>
        $activeRoute.allFragments.map(ar => ar.node).includes(p.rootNode),
    )

    $: index = routers.findIndex(r => r === activeSubRoute)
    $: console.log(activeSubRoute)
    $: console.log({ index })
</script>

<slot {pages} {index} />
