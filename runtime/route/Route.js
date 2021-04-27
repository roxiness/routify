import '../../typedef.js'
import { RouteFragment } from './RouteFragment.js'

export class Route {
    /** @type {RouteFragment[]} */
    fragments = []

    /**
     * @param {RoutifyRuntime} instance
     */
    constructor(instance, url, rootNode) {
        this.instance = instance
        this.url = url
        this.rootNode = rootNode
        this.setFragments(rootNode, url)
    }

    setFragments() {
        this.fragments = createFragments(this, this.rootNode, this.url)
    }

    createFragment(node, fragment) {
        this.fragments.push(new RouteFragment(this, node, fragment))
    }

    get params() {
        return this.fragments.reduce(
            (map, activePathNode) => Object.assign(map, activePathNode.params),
            {},
        )
    }
}

/**
 * @param {RNodeRuntime} rootNode
 * @param {string} $url
 */
export function createFragments(route, rootNode, $url) {
    const [, ...urlFragments] = $url.replace(/\/$/, '').split('/')

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
                    `${rootNode.rootName} could not find route: ${$url}`,
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

    const pathNodesWithComponent = routeFragments.filter(
        pathNode => pathNode.node.component,
    )

    if (!pathNodesWithComponent.length)
        throw new Error(`could not find route: ${$url}`)

    return pathNodesWithComponent
}
