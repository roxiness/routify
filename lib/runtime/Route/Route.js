import { RouteFragment } from './RouteFragment.js'

/** @type {UrlState[]} */
const URL_STATES = ['pushState', 'replaceState', 'popState']

export class Route {
    /** @type {RouteFragment[]} */
    allFragments = []
    /** @type {RouteFragment[]} only fragments with components */
    get fragments() {
        const moduleFragments = this.allFragments.filter(
            f => f.node.module || f.node.asyncModule,
        )
        return this.router.transformFragments.run(moduleFragments)
    }

    /** @type {Promise<{route: Route}>} */
    loaded

    /** @type {RoutifyLoadReturn} */
    load = {
        status: 200,
        error: null,
        maxage: null,
        props: {},
        redirect: null,
    }

    /**
     * @param {Router} router
     * @param {string} url
     * @param {UrlState} mode
     * @param {Object} mode a state to attach to the route
     */
    constructor(router, url, mode, state) {
        this.router = router
        this.url = url
        this.mode = mode
        this.state = state

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
        const query = (match && match[0]) || ''

        return Object.assign(
            {},
            ...this.allFragments.map(fragment => fragment.params),
            this.router.queryHandler.parse(query, this),
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
                if (!router.pendingRoute.get()) {
                    resolve({ route: router.activeRoute.get() })
                    return
                } else if (routerHasNewerPendingRoute) {
                    router.pendingRoute.get().loaded.then(resolve).catch(reject)
                    return
                } else if (!passedPreTask) {
                    router.pendingRoute.set(null)
                    return
                }
            }

            // the route made it through all pretasks, lets set it to active
            this.router.log.debug('set active route', this) // ROUTIFY-DEV-ONLY

            const $activeRoute = this.router.activeRoute.get()
            if ($activeRoute) router.history.push($activeRoute)

            router.activeRoute.set(this)

            router.afterUrlChange.run({
                route: this,
                history: [...router.history].reverse(),
            })

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
        await Promise.all(this.fragments.map(fragment => fragment.node.loadModule()))
        return true
    }

    async runPreloads() {
        this.log.debug('run preloads', this) // ROUTIFY-DEV-ONLY

        /** @type { RoutifyLoadContext } */
        const ctx = {
            route: this,
            node: [...this.fragments].pop()?.node,
        }

        for (const fragment of this.fragments) {
            if (fragment.node.module?.load) {
                fragment.load = await fragment.node.module.load(ctx)
                Object.assign(this.load, fragment.load)

                if (this.load.redirect) return this.router.url.replace(this.load.redirect)
            }
        }

        return this
    }

    // todo deprecate?
    async runGuards() {
        this.log.debug(`running guards for ${this.url}`, this) // ROUTIFY-DEV-ONLY

        const components = this.fragments
            .map(fragment => fragment.node.module)
            .filter(module => module?.guard)
        // process each component's guard
        for (const module of components) {
            console.warn(
                '"guard" will be deprecated. Please use "load.redirect" instead.',
            )
            const result = await module.guard(this)
            if (!result) return false
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
        const nodeChain = this.router.rootNode.getChainTo(this.url.replace(/#.+/, ''), {
            rootNode: this.router.rootNode,
        })
        const fragments = nodeChain.map(
            nc => new RouteFragment(this, nc.node, nc.fragment, nc.params),
        )
        return fragments
    }
}
