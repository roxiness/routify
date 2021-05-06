import '../../../typedef.js'
import { RouteFragment } from './RouteFragment.js'

export class Route {
    /** @type {RouteFragment[]} */
    fragments = []

    /**
     * @param {Router} router
     */
    constructor(router, url) {
        this.router = router
        this.url = url
        this.setFragments()
    }

    setFragments() {
        const fragments = createFragments(this)

        this.fragments = fragments
    }

    get params() {
        return this.fragments.reduce(
            (map, activePathNode) => Object.assign(map, activePathNode.params),
            {},
        )
    }
}

/**
 * @param {Route} route
 */
export function createFragments(route) {
    const { url, router } = route
    const { rootNode } = router

    const [, ...urlFragments] = url.url.replace(/\/$/, '').split('/')

    let node = rootNode

    const routeFragments = [new RouteFragment(route, node, '')] // start with rootNode

    for (const urlFragment of urlFragments) {
        // child by name
        const child =
            node.children.find(child => child.name === urlFragment) ||
            node.children.find(child => child.regex.test(urlFragment))

        if (child) {
            node = child
            routeFragments.push(new RouteFragment(route, node, urlFragment))
        } else {
            const fallbackIndex = routeFragments
                .map(pn => !!pn.node.fallback)
                .lastIndexOf(true)

            if (fallbackIndex === -1)
                throw new Error(
                    `${rootNode.rootName} could not find route: ${url.url}`,
                )

            routeFragments.splice(fallbackIndex + 1)
            routeFragments.push(routeFragments[fallbackIndex].node.fallback)
            break
        }
    }

    let lastNode = routeFragments[routeFragments.length - 1].node
    while (lastNode) {
        lastNode = lastNode.children.find(node => node.name === 'index')
        if (lastNode)
            routeFragments.push(new RouteFragment(route, lastNode, ''))
    }

    const offsetIndex =
        Number(router.offset) ||
        routeFragments.findIndex(f => f.node === router.offset) + 1

    const fragments = routeFragments.splice(offsetIndex)
    if (!fragments.filter(({ node }) => node.component).length)
        throw new Error(`could not find route: ${url.url}`)

    return fragments
}
