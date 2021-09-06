import '#root/typedef.js'
import { RouteFragment } from './RouteFragment.js'
import {
    getNearestAncestorNodeWithSpreadParam,
    getUrlFragments,
    indexOfNode,
    spreadsLast,
} from './utils.js'

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
        router.log.debug('created route', this) // ROUTIFY-DEV-ONLY
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

    /**
     * creates fragments. A fragment is the section between each / in the URL
     */
    _createFragments() {
        const { url = '', router } = this
        const { rootNode, offset } = router

        /** @type {string[]} */
        let currentSpreadParam = []
        let currentNode = offset || rootNode

        const createFragment = (node, urlFragment, spreadParam) => {
            const fragment = new RouteFragment(this, node, urlFragment)
            const spreadMatch = node.name.match(/\[\.\.\.(.+)\]/)
            if (spreadMatch) spreadParam.push(urlFragment)
            else spreadParam = []
            if (spreadMatch) fragment.setParams({ [spreadMatch[1]]: spreadParam })
            else fragment.setParams(fragment.getParamsFromFragment()) //todo create setParamsFromFragment function
            return fragment
        }

        const urlFragments = getUrlFragments(url)
        const routeFragments = [new RouteFragment(this, currentNode, '')]

        // iterate through each url fragment (eg.: 'blog', 'posts', 'some-slug', 'comments')
        for (let ufIndex = 0; ufIndex < urlFragments.length; ufIndex++) {
            const urlFragment = urlFragments[ufIndex]
            const children = currentNode.children.public.filter(
                child => !child.name.startsWith('_'),
            )

            const child =
                children.find(child => child.name === urlFragment) ||
                children.sort(spreadsLast).find(child => child.regex.test(urlFragment))

            if (child) {
                routeFragments.push(
                    createFragment(child, urlFragment, currentSpreadParam),
                )
                currentNode = child
            } else if (currentSpreadParam.length) {
                // if currentSpreadParam isn't empty we're part of a spread parameter
                // and our urlFragment is a parameter value
                currentSpreadParam.push(urlFragment)
            } else {
                // if no child node matches the fragment
                // and we're not descended from a node with spread operator param
                // check if there's a spread operator node we can use further down the tree
                const nearestSpreadNode =
                    getNearestAncestorNodeWithSpreadParam(routeFragments)
                if (nearestSpreadNode) {
                    const nodeIndex = indexOfNode(routeFragments, nearestSpreadNode)

                    const removed = routeFragments.splice(nodeIndex)
                    ufIndex = ufIndex - removed.length
                    routeFragments.push(
                        createFragment(
                            nearestSpreadNode,
                            urlFragments[ufIndex],
                            currentSpreadParam,
                        ),
                    )

                    currentNode = nearestSpreadNode
                } else {
                    // if there's no spread operator parameter further down the tree
                    // return the fallback component
                    const fallback = currentNode._fallback
                    const fallbackOutOfBounds = fallback?.level < offset?.level

                    if (!fallback || fallbackOutOfBounds) {
                        throw new Error(
                            `${rootNode.rootName} could not find route: ${url}`,
                        )
                    } else {
                    }
                    routeFragments.splice(fallback.level)
                    routeFragments.push(new RouteFragment(this, fallback, ''))
                    break
                }
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
            throw new Error(`could not find route: ${url}`)

        return fragments
    }
}
