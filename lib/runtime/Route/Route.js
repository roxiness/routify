import '#root/typedef.js'
import { RouteFragment } from './RouteFragment.js'

/** @type {UrlState[]} */
const URL_STATES = ['pushState', 'replaceState', 'popState']

export class Route {
    /** @type {RouteFragment[]} */
    fragments = []

    /**
     * @param {Router} router
     * @param {string} url
     * @param {UrlState} mode
     */
    constructor(router, url, mode) {
        this.router = router
        this.url = url
        this.mode = mode

        if (!URL_STATES.includes(mode))
            throw new Error('url.mode must be pushState, replaceState or popState')

        this.fragments = this._createFragments()
        router.log.debug('created route', this)
    }

    get params() {
        const match = this.url.match(/\?.+/)
        const query = match && match[0]

        return Object.assign(
            {},
            ...this.fragments.map(node => node.params),
            query && this.router.queryHandler.parse(query),
        )
    }

    async loadComponents() {
        await Promise.all(
            this.fragments.map(async fragment => {
                if (typeof fragment.node.component === 'function')
                    // @ts-ignore
                    fragment.node.component = await fragment.node.component()
            }),
        )
    }

    async runPreloads() {
        const promises = this.fragments
            .filter(fragment => fragment.node.component?.load)
            .map(async fragment => (fragment.load = await fragment.node.component.load()))

        await Promise.all(promises)
    }

    async runGuards() {
        const components = this.fragments
            .map(fragment => fragment.node.component)
            .filter(component => component?.guard)
        for (const component of components)
            if (!(await component.guard(this))) return false
        return true
    }

    async runBeforeUrlChangeHooks() {
        await Promise.all(
            this.router.beforeUrlChange.hooks.map(async hook => {
                if (!(await hook(this))) return false
            }),
        )
        return true
    }

    _createFragments() {
        const { url, router } = this
        const { rootNode, offset } = router
        let urlStr = url || ''

        const [, ...urlFragments] = urlStr.replace(/\/$/, '').split(/[/?]/)

        // todo offset should be moved to rootNode
        let node = offset || rootNode

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
            lastNode = lastNode.children.index
            if (lastNode) routeFragments.push(new RouteFragment(this, lastNode, ''))
        }

        const offsetIndex = Number(offset) || 0

        const fragments = routeFragments.splice(offsetIndex)
        if (!fragments.filter(({ node }) => node.component).length)
            throw new Error(`could not find route: ${urlStr}`)

        return fragments
    }
}
