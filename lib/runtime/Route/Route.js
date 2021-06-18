import '#root/typedef.js'
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
        this.fragments = this._createFragments()
        router.log.debug('created route', this)
    }

    get params() {
        return this.fragments.reduce(
            (map, activePathNode) => Object.assign(map, activePathNode.params),
            {},
        )
    }

    async loadComponents() {
        const promises = this.fragments.map(async fragment => {
            if (typeof fragment.node.component === 'function')
                fragment.node.component = await fragment.node.component()
        })
        return await Promise.all(promises)
    }

    _createFragments() {
        const { url, router } = this
        const { rootNode, offset } = router
        let urlStr = url.url || ''

        const [, ...urlFragments] = urlStr.replace(/\/$/, '').split('/')

        let node = rootNode

        const routeFragments = [new RouteFragment(this, node, '')] // start with rootNode

        // iterate through each url fragment (eg.: 'blog', 'posts', 'some-slug', 'comments')
        for (const urlFragment of urlFragments) {
            const children = node.children.public.filter(
                child => !child.name.startsWith('_'),
            )

            // child by name
            const child =
                children.find(child => child.name === urlFragment) ||
                children.find(child => child.regex.test(urlFragment))

            if (child) {
                node = child
                routeFragments.push(new RouteFragment(this, node, urlFragment))
            } else {
                const fallback = node._fallback

                if (!fallback)
                    throw new Error(
                        `${rootNode.rootName} could not find route: ${urlStr}`,
                    )

                routeFragments.splice(fallback._depth)
                routeFragments.push(new RouteFragment(this, fallback, ''))
                break
            }
        }

        let lastNode = routeFragments[routeFragments.length - 1].node
        while (lastNode) {
            lastNode = lastNode.children.find(node => node.name === 'index')
            if (lastNode) routeFragments.push(new RouteFragment(this, lastNode, ''))
        }

        const offsetIndex =
            Number(offset) || routeFragments.findIndex(f => f.node === offset) + 1

        const fragments = routeFragments.splice(offsetIndex)
        if (!fragments.filter(({ node }) => node.component).length)
            throw new Error(`could not find route: ${urlStr}`)

        return fragments
    }
}
