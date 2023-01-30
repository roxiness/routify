/**
 * @typedef { Object } ParentCmpCtx
 * @prop { Route } route
 * @prop { RNodeRuntime } node
 * @prop { Object.<String|Number, String|Number> } localParams
 * @prop { Object.<String|Number, any> } options
 */

import { derived, get, writable } from 'svelte/store'
import { Route } from '../Route/Route.js'
import {
    fromEntries,
    urlFromAddress,
    getContextMaybe,
    getable,
    identicalRoutes,
} from '../utils/index.js'
import { BaseReflector } from './urlReflectors/ReflectorBase.js'
import { appInstance } from '../Global/Global.js'
import { RoutifyRuntime } from '../Instance/RoutifyRuntime.js'
import { AddressReflector } from './urlReflectors/Address.js'
import { InternalReflector } from './urlReflectors/Internal.js'
import {
    createGuardsCollection,
    createPipelineCollection,
    createSequenceHooksCollection,
} from 'hookar'
import reset from '../plugins/reset/index.js'
import { next } from '../../common/utils.js'
import { normalizeRouterOptions } from './utils/index.js'

// todo move stripNullFields and normalizeRouterOptions to utils file.
const stripNullFields = obj =>
    Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null))

const defaultPlugins = [reset()]

/**
 * @implements { Readable<Router> }
 */
export class Router {
    /** @type { RouteStore } */
    pendingRoute = getable(null)
    /** @type { RouteStore } */
    activeRoute = getable(null)

    _urlReflector = null

    /** @type {UrlRewrite[]} */
    urlRewrites = []

    /** @type { import('hookar').HooksCollection<RouterInitCallback> } */
    beforeRouterInit = createSequenceHooksCollection()
    /** @type { import('hookar').HooksCollection<RouterInitCallback> } */
    afterRouterInit = createSequenceHooksCollection()
    /** @type { import('hookar').HooksCollection<BeforeUrlChangeCallback> } */
    beforeUrlChange = createGuardsCollection()
    /** @type { import('hookar').HooksCollection<AfterUrlChangeCallback> } */
    afterUrlChange = createSequenceHooksCollection()
    /** @type { import('hookar').HooksCollection<TransformFragmentsCallback> } */
    transformFragments = createPipelineCollection()
    /** @type { import('hookar').HooksCollection<OnDestroyRouterCallback> } */
    onDestroy = createSequenceHooksCollection()

    parentElem = null

    /** @type {QueryHandler} */
    queryHandler = {
        parse: (search, route) => fromEntries(new URLSearchParams(search)),
        stringify: (params, route) => {
            const query = new URLSearchParams(params).toString()
            return query ? `?${query}` : ''
        },
    }

    /** @type {ClickHandler} */
    clickHandler = {}

    url = {
        internal: () => this.url.getPending() || this.url.getActive(),
        external: () => this.getExternalUrl(),
        getActive: () => get(this.activeRoute)?.url,
        getPending: () => get(this.pendingRoute)?.url,
        toString: () => this.url.internal(),
        set: this._setUrl.bind(this),
        push: (url, state = {}) => this._setUrl(url, 'pushState', false, state),
        replace: (url, state = {}) => this._setUrl(url, 'replaceState', false, state),
        pop: (url, state = {}) => this._setUrl(url, 'popState', false, state),
    }

    /**
     * function that resolves after the active route has changed
     * @returns {Promise<Route>} */
    ready = async () =>
        (!this.pendingRoute.get() && this.activeRoute.get()) ||
        next(this.activeRoute, x => !!x)

    /** @type {Route[]} */
    history = []

    /**
     * @param {Partial<RoutifyRuntimeOptions>} input
     */
    constructor(input) {
        const { subscribe, set } = writable(this)
        this.subscribe = subscribe
        this.triggerStore = () => set(this)

        const oldRouter = appInstance.routers.find(r => r.name == (input.name || ''))
        if (oldRouter) return oldRouter
        else {
            input.plugins = [...(input.plugins || []), ...defaultPlugins].filter(Boolean)
            this.init(input)
            this.params = derived(this.activeRoute, $activeRoute => $activeRoute.params)
            // we're using setTimeout to make sure outgoing routers have been destroyed
            // this also prevents the first router from absorbing the url from the address and
            // then reflecting only its internal url before other routers have absorbed the url
            this.afterUrlChange(() => setTimeout(() => this._urlReflector.reflect()))
            this.activeRoute.get = () => get(this.activeRoute)
            this.pendingRoute.get = () => get(this.pendingRoute)
        }
    }

    /**
     * @param {Partial<RoutifyRuntimeOptions>} input
     */
    init(input) {
        const firstInit = !this.options

        // we need to strip undefine / null fields since they would overwrite existing options
        input = stripNullFields(input)
        /** @type {Partial<import('./utils').RouterOptionsNormalized>} */
        this.options = normalizeRouterOptions({ ...this.options, ...input })

        let {
            instance,
            rootNode,
            name,
            routes,
            urlRewrite,
            urlReflector,
            url,
            passthrough,
            beforeUrlChange,
            afterUrlChange,
            transformFragments,
            onDestroy,
            beforeRouterInit,
            afterRouterInit,
            queryHandler,
            clickHandler,
        } = this.options

        if (queryHandler) this.queryHandler = queryHandler
        if (clickHandler) this.clickHandler = clickHandler

        beforeUrlChange.forEach(this.beforeUrlChange)
        transformFragments.forEach(this.transformFragments)
        afterUrlChange.forEach(this.afterUrlChange)
        onDestroy.forEach(this.onDestroy)
        beforeRouterInit.forEach(this.beforeRouterInit)
        afterRouterInit.forEach(this.afterRouterInit)

        this.beforeRouterInit.run({ router: this, firstInit })

        const parentCmpCtx = getContextMaybe('routify-fragment-context')

        /** @type {RoutifyRuntime} */
        this.instance =
            instance ||
            this.instance ||
            parentCmpCtx?.route.router.instance ||
            appInstance.instances[0] ||
            new RoutifyRuntime({})

        this.name = name
        this.urlRewrites = urlRewrite

        // ROUTIFY-DEV-ONLY-START
        this.log =
            this.log || this.instance.log.createChild(this.name || '[unnamed instance]')
        // ROUTIFY-DEV-ONLY-END

        if (passthrough && !(passthrough instanceof Router))
            passthrough = parentCmpCtx?.route.router || passthrough

        this.passthrough = passthrough || this.passthrough

        // remove from old instance, in case the instance changed
        appInstance.instances.forEach(inst => {
            const index = inst.routers.indexOf(this)
            if (index !== -1) inst.routers.splice(index, 1)
        })
        // add to current instance
        this.instance.routers.push(this)

        if (routes && !this.rootNode) this.importRoutes(routes)

        this.parentCmpCtx = parentCmpCtx
        /** @type {RNodeRuntime} */
        this.rootNode = rootNode || this.rootNode || this.instance.rootNodes.default

        this.log.debug('initiated router') // ROUTIFY-DEV-ONLY

        if (this.url.getActive()) {
            this.log.debug('router was created with activeUrl') // ROUTIFY-DEV-ONLY
            this._setUrl(this.url.getActive(), 'pushState', true)
        }

        const shouldInstallUrlReflector =
            !this.urlReflector ||
            (urlReflector && !(this.urlReflector instanceof urlReflector))

        if (shouldInstallUrlReflector) {
            urlReflector =
                urlReflector ||
                (typeof window != 'undefined' ? AddressReflector : InternalReflector)
            this.setUrlReflector(urlReflector)
        }

        if (url) this.url.replace(url)
        this.triggerStore()
        this.afterRouterInit.run({ router: this, firstInit })
    }

    /** @param {HTMLElement} elem */
    setParentElem = elem => {
        this.parentElem = elem
    }

    importRoutes(routes) {
        this.rootNode = this.instance.createNode().importTree(routes)
        this.instance.rootNodes[routes.rootName || 'unnamed'] = this.rootNode
    }

    /**
     * converts a URL or Routify's internal URL to an external URL (for the browser)
     * @param {string=} url
     * @returns
     */
    getExternalUrl = url => {
        const result = this.urlRewrites.reduce(
            (_url, rewrite) => rewrite.toExternal(_url, { router: this }),
            url || this.url.internal(),
        )
        return result
    }

    /**
     * converts an external URL (from the browser) to an internal URL
     * @param {string} url
     * @returns
     */
    getInternalUrl = url =>
        this.urlRewrites.reduce(
            (_url, rewrite) => rewrite.toInternal(_url, { router: this }),
            url,
        )

    /**
     *
     * @param {string} url
     * @param {UrlState} mode pushState, replaceState or popState
     * @param {boolean} [isInternal=false] if the URL is already internal, skip rewrite.toInternal
     * @param {Object=} state a state to attach to the route
     * @returns {Promise<true|false>}
     */
    async _setUrl(url, mode, isInternal, state = {}) {
        if (!isInternal) url = this.getInternalUrl(url)

        url = url || '/'
        url = url.replace(/(.+)\/+([#?]|$)/, '$1$2') // strip trailing slashes
        const { activeRoute, pendingRoute } = this

        // ROUTIFY-DEV-ONLY-START
        const { debug, groupCollapsed, trace, groupEnd } = this.log
        if (this.log.level >= 4) {
            const info = {
                url,
                mode,
                prev: this.url.internal(),
                browserOld: urlFromAddress(),
                state,
            }
            ;[groupCollapsed('set url', info), trace(), groupEnd()]
        }
        // ROUTIFY-DEV-ONLY-END

        if (!url.startsWith('/')) url = url.replace(new URL(url).origin, '')

        const route = new Route(this, url, mode, state)

        const currentRoute = pendingRoute.get() || activeRoute.get()
        if (identicalRoutes(currentRoute, route)) {
            debug('current route is identical - skip', currentRoute, route) // ROUTIFY-DEV-ONLY
            return true
        }

        route.log.debug('set pending route', route) // ROUTIFY-DEV-ONLY
        pendingRoute.set(route)
        await route.loadRoute()

        return true
    }

    destroy() {
        this.log.debug(`destroying router`) // ROUTIFY-DEV-ONLY
        this.instance.routers = this.instance.routers.filter(router => router !== this)
        this.onDestroy.run({ router: this })
    }

    /** @type {BaseReflector} */
    get urlReflector() {
        return this._urlReflector
    }

    /** @param {typeof BaseReflector} UrlReflector */
    setUrlReflector(UrlReflector) {
        this._urlReflector?.uninstall()
        this._urlReflector = new UrlReflector(this)
        this._urlReflector.install()
        this.triggerStore()
    }
}

/**
 * Creates a new router
 * @param  {Partial<RoutifyRuntimeOptions>} options
 */
export const createRouter = options => new Router(options)
