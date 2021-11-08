import { get } from 'svelte/store'
import { RouteFragment } from './RouteFragment.js'
import {
    getNearestAncestorNodeWithSpreadParam,
    getUrlFragments,
    indexOfNode,
    spreadsLast,
} from './utils.js'
import * as msgs from '../../common/debugMsg.js'

/** @type {UrlState[]} */
const URL_STATES = ['pushState', 'replaceState', 'popState']

export class Route {
    /** @type {RouteFragment[]} */
    allFragments = []
    /** @type {RouteFragment[]} only fragments with components */
    get fragments() {
        return this.allFragments.filter(f => f.node.module)
    }

    /** @type {Promise<{route: Route}>} */
    loaded

    invalid = null

    /**
     * @param {Router} router
     * @param {string} url
     * @param {UrlState} mode
     */
    constructor(router, url, mode) {
        this.router = router
        this.url = url
        this.mode = mode

        if (!router.rootNode) {
            this.router.log.error("Can't navigate without a rootNode")
            const err = new Error("Can't navigate without a rootNode")
            Object.assign(err, { routify: { router } })
            throw err
        }

        if (!URL_STATES.includes(mode))
            throw new Error('url.mode must be pushState, replaceState or popState')

        this.allFragments = this._createFragments()
        this.log = router.log.createChild('[route]') // ROUTIFY-DEV-ONLY
        this.log.debug('created', this) // ROUTIFY-DEV-ONLY
    }

    get params() {
        const match = this.url.match(/\?.+/)
        const query = match && match[0]

        return Object.assign(
            {},
            ...this.allFragments.map(fragment => fragment.params),
            query && this.router.queryHandler.parse(query),
        )
    }

    async loadRoute() {
        const { router } = this
        const pipeline = [
            this.runBeforeUrlChangeHooks,
            this.loadComponents,
            this.runGuards,
            this.runPreloads,
        ]

        this.loaded = new Promise(async (resolve, reject) => {
            for (const pretask of pipeline) {
                const passedPreTask = await pretask.bind(this)()
                const routerHasNewerPendingRoute = this !== router.pendingRoute.get()
                if (routerHasNewerPendingRoute) {
                    router.pendingRoute.get().loaded.then(resolve).catch(reject)
                } else if (!passedPreTask) {
                    router.pendingRoute.set(null)
                    reject('pretask failed')
                }
                if (!passedPreTask || routerHasNewerPendingRoute) return
            }

            // the route made it through all pretasks, lets set it to active
            this.router.log.debug('set active route', this) // ROUTIFY-DEV-ONLY

            const $activeRoute = this.router.activeRoute.get()
            if ($activeRoute) router.history.push($activeRoute)

            router.activeRoute.set(this)
            const _history = [...router.history].reverse()

            router.afterUrlChange.run({ route: this }, _history)

            this.router.log.debug('unset pending route', this) // ROUTIFY-DEV-ONLY
            router.pendingRoute.set(null)
            resolve({ route: this })
        })
        return this.loaded
    }

    /**
     * converts async module functions to sync functions
     */
    async loadComponents() {
        this.log.debug('load components', this) // ROUTIFY-DEV-ONLY
        await Promise.all(
            this.fragments.map(async fragment => {
                const module = await fragment.node.module()
                fragment.node.module = () => module
            }),
        )
        return true
    }

    async runPreloads() {
        this.log.debug('run preloads', this) // ROUTIFY-DEV-ONLY

        /** @type { RoutifyLoadContext } */
        const ctx = {
            route: this,
            node: [...this.fragments].pop().node,
        }
        const promises = this.fragments
            .filter(fragment => fragment.node.module()?.load)
            .map(
                async fragment =>
                    (fragment.load = await fragment.node.module().load(ctx)),
            )

        await Promise.all(promises)
        return true
    }

    async runGuards() {
        this.log.debug(`running guards for ${this.url}`, this) // ROUTIFY-DEV-ONLY

        const components = this.fragments
            .map(fragment => fragment.node.module())
            .filter(module => module?.guard)
        // process each component's guard
        for (const module of components) {
            const result = await module.guard(this)
            // if we're not getting a truthy response or the route has been invalidated, return false
            if (!result || this.invalid) return false
        }
        return true
    }

    async runBeforeUrlChangeHooks() {
        return await this.router.beforeUrlChange.run({ route: this })
    }

    /**
     * creates fragments. A fragment is the section between each / in the URL
     */
    _createFragments() {
        const { url = '', router } = this
        const { rootNode } = router

        /** @type {string[]} */
        let currentSpreadParam = []
        let currentNode = rootNode

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
            const children = currentNode.children.filter(
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

                    if (!fallback) {
                        throw new Error(
                            `router: "${
                                router.name || '[default]'
                            }" could not find route: ${url}`,
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
            lastNode = lastNode.children.find(node => node.name === 'index')
            if (lastNode) routeFragments.push(new RouteFragment(this, lastNode, ''))
        }

        if (!routeFragments.filter(({ node }) => node.module).length)
            throw new Error(`could not find route: ${url}`)

        return routeFragments
    }
}
