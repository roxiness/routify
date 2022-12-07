import { RouteFragment } from './RouteFragment.js'

/** @type {UrlState[]} */
const URL_STATES = ['pushState', 'replaceState', 'popState']

export class Route {
    /** @type {RouteFragment[]} */
    allFragments = []
    /** @type {RouteFragment[]} only fragments with components */
    get fragments() {
        return this.router.transformFragments.run(this.allFragments)
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
     * @param {Object} state a state to attach to the route
     */
    constructor(router, url, mode, state = {}) {
        const [, anchor] = url.match(/#(.+)/) || []

        this.router = router
        this.url = url
        this.mode = mode
        this.state = state
        this.anchor = anchor

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

    get leaf() {
        return [...this.allFragments].pop()
    }

    get isPending() {
        return this === this.router.pendingRoute.get()
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
                if (!router.pendingRoute.get()) {
                    resolve({ route: router.activeRoute.get() })
                    return
                } else if (!this.isPending) {
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

        const prevRoute = this.router.activeRoute.get()

        for (const [index, fragment] of this.fragments.entries()) {
            // if something happened and this route is no longer pending, abort
            if (!this.isPending) return false

            const prevFragmentInSpot = prevRoute?.fragments[index]
            const isSameBranch = fragment.node === prevFragmentInSpot?.node

            /** @type { RoutifyLoadContext } */
            const ctx = {
                route: this,
                prevRoute,
                isNew: !isSameBranch,
            }

            if (fragment.node.module?.load) {
                fragment.load = {
                    ...(isSameBranch && prevFragmentInSpot.load),
                    ...(await fragment.node.module.load(ctx)),
                }
                Object.assign(this.load, fragment.load)

                if (this.load.redirect)
                    return this.router.url.replace(this.load.redirect, {
                        redirectedBy: this,
                    })
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
     * @param {RNodeRuntime} node the node that corresponds to the fragment
     * @param {String=} urlFragment a fragment of the url (fragments = url.split('/'))
     * @param {Object<string, any>=} params
     */
    createFragment(node, urlFragment = '', params = {}) {
        return new RouteFragment(this, node, urlFragment, params)
    }

    /**
     * creates fragments. A fragment is the section between each / in the URL
     */
    _createFragments() {
        const url = this.url.replace(/[#?].+/, '')
        const rootNode = this.router.rootNode
        const nodeChain = this.router.rootNode.getChainTo(url, {
            rootNode,
            allowDynamic: true,
            includeIndex: true,
        })
        const fragments = nodeChain.map(nc =>
            this.createFragment(nc.node, nc.fragment, nc.params),
        )
        return fragments
    }
}
