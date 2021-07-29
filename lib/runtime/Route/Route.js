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

    /**
     * converts async module functions to sync functions
     */
    async loadComponents() {
        await Promise.all(
            this.fragments.map(async fragment => {
                const module = await fragment.node.module()
                fragment.node.module = () => module
            }),
        )
    }

    async runPreloads() {
        const promises = this.fragments
            .filter(fragment => fragment.node.module()?.load)
            .map(async fragment => (fragment.load = await fragment.node.module().load()))

        await Promise.all(promises)
    }

    async runGuards() {
        const components = this.fragments
            .map(fragment => fragment.node.module())
            .filter(module => module?.guard)
        for (const module of components) if (!(await module.guard(this))) return false
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

        const [, ...urlFragments] = urlStr
            .replace(/\?.+/, '') // strip the search query
            .replace(/\/$/, '') // strip trailing slash
            .split('/')

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

        const fragments = routeFragments
            .splice(offsetIndex)
            .filter(fragment => fragment.node.module)

        if (!fragments.filter(({ node }) => node.module).length)
            throw new Error(`could not find route: ${urlStr}`)

        return fragments
    }
}
