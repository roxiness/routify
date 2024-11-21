import { createUrl } from '../helpers/index.js'
import { populateUrl } from '../utils/index.js'
import { RouteFragment } from './RouteFragment.js'
import { LoadCache } from './utils.js'

/** @type {UrlState[]} */
const URL_STATES = ['pushState', 'replaceState', 'popState']

const loadCache = new LoadCache()

let id = 0

export class Route {
    /** @type {RouteFragment[]} */
    allFragments = []
    /** @type {RouteFragment[]} only fragments with components */
    fragments = []

    /** @type {RoutifyLoadReturn} */
    load = {
        status: 200,
        error: null,
        maxage: null,
        props: {},
        redirect: null,
    }

    /** @type {Route} */
    prevRoute
    /** @type {Route} */
    nextRoute

    /**
     * @param {Router} router
     * @param {string} url
     * @param {UrlState} mode
     * @param {Object} state a state to attach to the route
     */
    constructor(router, url, mode, state = {}) {
        this.sourceUrl = typeof url === 'string' ? new URL(url, 'http://localhost') : url

        this.router = router
        this.mode = mode
        this.state = state
        this.state.createdAt = new Date()
        this.state.id = this.state.id ?? Date.now() + '-' + id++

        if (!router.rootNode) {
            const err = new Error(
                "Can't navigate without a rootNode. Have you imported routes?",
            )
            Object.assign(err, { routify: { router } })
            throw err
        }

        if (!URL_STATES.includes(mode))
            throw new Error('url.mode must be pushState, replaceState or popState')

        this.allFragments = this._createFragments(this.sourceUrl.pathname)

        this.params = { ...this.queryParams, ...this.fragmentParams }

        this.fragments = this.router.transformFragments.run(this.allFragments)

        this.url = this._createUrl()
        this.rendered = Promise.all(this.fragments.map(f => f.renderContext))
        this.log = router.log.createChild('[route]') // ROUTIFY-DEV-ONLY
        this.log.debug('created', this) // ROUTIFY-DEV-ONLY
    }

    get fragmentParams() {
        return this.allFragments.reduce((acc, curr) => ({ ...acc, ...curr.params }), {})
    }

    get queryParams() {
        return this.router.queryHandler.parse(this.sourceUrl.search, this)
    }

    get leaf() {
        return [...this.fragments].pop()
    }

    get isPendingOrPrefetch() {
        return this === this.router.pendingRoute.get() || this.state.prefetch
    }

    async loadRoute() {
        const pipeline = [
            this.runBeforeUrlChangeHooks,
            this.loadComponents,
            this.runPreloads,
        ]

        // todo get rid of this.loaded and use loadRoute() 's promise instead

        for (const pretask of pipeline) {
            const passedPreTask = await pretask.bind(this)()
            // if this is not the pending route
            // or a pipeline entry failed, halt and return
            if (!this.isPendingOrPrefetch || !passedPreTask) return false
        }

        this.log.debug('loaded route', this) // ROUTIFY-DEV-ONLY

        return true
    }

    /**
     * converts async module functions to sync functions
     */
    async loadComponents() {
        this.log.debug('load components', this) // ROUTIFY-DEV-ONLY
        const nodes = this.fragments.map(fragment => fragment.node)
        const multiNodes = nodes
            .map(node =>
                node.children.find(
                    node => node.meta.isDecorator || node.meta.isInlineWrapper,
                ),
            )
            .filter(Boolean)

        await Promise.all([...nodes, ...multiNodes].map(node => node.loadModule()))
        return true
    }

    async runPreloads() {
        this.log.debug('run preloads', this) // ROUTIFY-DEV-ONLY

        const prevRoute = this.router.activeRoute.get()

        for (const [index, fragment] of this.fragments.entries()) {
            // if something happened and this route is no longer pending, abort
            if (!this.isPendingOrPrefetch) return false

            const prevFragmentInSpot = prevRoute?.fragments[index]
            const isSameBranch = fragment.node === prevFragmentInSpot?.node

            /** @type { RoutifyLoadContext } */
            const ctx = {
                route: this,
                url: createUrl(fragment, this.router),
                prevRoute,
                isNew: !isSameBranch,
                fetch,
                fragment,
            }

            if (fragment.node.module?.load) {
                const cacheId = JSON.stringify([this.params, fragment.node.id])

                const load = await loadCache.fetch(cacheId, {
                    hydrate: () => fragment.node.module.load(ctx),
                    // if no expire is set clear it on load, unless it's a prefetch
                    clear: res => res?.expire || !this.state.prefetch,
                })

                fragment.load = {
                    ...(isSameBranch && prevFragmentInSpot.load),
                    ...load,
                }
                Object.assign(this.load, fragment.load)

                if (this.load.redirect && !this.state.prefetch)
                    return this.router.url.replace(this.load.redirect, {
                        redirectedBy: this,
                    })
            }
        }

        return this
    }

    async runBeforeUrlChangeHooks() {
        return await this.router.beforeUrlChange.run({ route: this })
    }

    get meta() {
        return this.fragments.reduce((acc, curr) => ({ ...acc, ...curr.node.meta }), {})
    }

    /**
     * @param {RNodeRuntime} node the node that corresponds to the fragment
     * @param {String=} urlFragment a fragment of the url (fragments = url.split('/'))
     * @param {Object<string, any>=} params
     * @returns {RouteFragment}
     */
    createFragment(node, urlFragment = '', params = {}) {
        return new RouteFragment(this, node, urlFragment, params)
    }

    /**
     * creates fragments. A fragment is the section between each / in the URL
     */
    _createFragments(pathname) {
        const rootNode = this.router.rootNode
        const nodeChain = this.router.rootNode.getChainTo(pathname, {
            rootNode,
            allowDynamic: true,
            includeIndex: true,
            navigableChildrenOnly: true,
        })
        const fragments = nodeChain.map(nc =>
            this.createFragment(nc.node, nc.fragment, nc.params),
        )
        return fragments
    }

    _createUrl() {
        const queryStringifier = obj => this.router.queryHandler.stringify(obj, this)
        // index 0 is the root node, which is always empty
        const path = this.allFragments.map((f, i) => (i ? f.node.name : '')).join('/')
        const populatedUrl = populateUrl(path, this.params, queryStringifier)

        const shouldAddSlash =
            this.router.options.trailingSlash === 'always' ||
            (this.router.options.trailingSlash === 'preserve' &&
                this.sourceUrl.pathname.endsWith('/')) ||
            (this.router.options.trailingSlash === 'contextual' &&
                [...this.allFragments].pop().node.name === 'index')

        const slash = shouldAddSlash ? '/' : ''

        return (
            populatedUrl.path.replace(/\/index$/, '') +
            slash +
            populatedUrl.query +
            this.sourceUrl.hash
        )
    }
}
