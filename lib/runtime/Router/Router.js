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
    getable,
    identicalRoutes,
    getRoutifyFragmentContextMaybe,
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
import scroller from '../plugins/scroller/plugin.js'

import { next } from '../../common/utils.js'
import { normalizeRouterOptions } from './utils/index.js'
import { URIDecodeObject } from '../Route/utils.js'

// todo move stripNullFields and normalizeRouterOptions to utils file.
const stripNullFields = obj =>
    Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null))

const defaultPlugins = [reset(), scroller()]

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
    /** @type { import('hookar').HooksCollection<AfterRouteRenderedCallback> } */
    afterRouteRendered = createSequenceHooksCollection()
    /** @type { import('hookar').HooksCollection<TransformFragmentsCallback> } */
    transformFragments = createPipelineCollection()
    onMount = createSequenceHooksCollection()
    /** @type { import('hookar').HooksCollection<OnDestroyRouterCallback> } */
    onDestroy = createSequenceHooksCollection()

    parentElem = null

    /** @type {QueryHandler} */
    queryHandler = {
        parse: (search, route) =>
            URIDecodeObject(fromEntries(new URLSearchParams(search))),
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
        const matchingRouter = appInstance.routers.find(r => r.name == (input.name || ''))
        if (matchingRouter) {
            matchingRouter.init(input)
            return matchingRouter
        }

        this.parentCmpCtx = getRoutifyFragmentContextMaybe()

        const { subscribe, set } = writable(this)
        this.subscribe = subscribe
        this.triggerStore = () => set(this)

        this.init(input)
        this.params = derived(this.activeRoute, $activeRoute => $activeRoute.params)
        // we're using setTimeout to make sure outgoing routers have been destroyed
        // this also prevents the first router from absorbing the url from the address and
        // then reflecting only its internal url before other routers have absorbed the url
        this.afterUrlChange(() => setTimeout(() => this._urlReflector.reflect()))
        this.activeRoute.get = () => get(this.activeRoute)
        this.pendingRoute.get = () => get(this.pendingRoute)
    }

    /**
     * @param {Partial<RoutifyRuntimeOptions>} input
     */
    init(input) {
        const firstInit = !this.options

        input.plugins = [...defaultPlugins, ...(input.plugins || [])].filter(Boolean)

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
            afterRouteRendered,
            transformFragments,
            onMount,
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
        afterRouteRendered.forEach(this.afterRouteRendered)
        onMount.forEach(this.onMount)
        onDestroy.forEach(this.onDestroy)
        beforeRouterInit.forEach(this.beforeRouterInit)
        afterRouterInit.forEach(this.afterRouterInit)

        this.beforeRouterInit.run({ router: this, firstInit })

        /** @type {RoutifyRuntime} */
        this.instance =
            instance ||
            this.instance ||
            this.parentCmpCtx?.route?.router?.instance ||
            appInstance.instances[0] ||
            new RoutifyRuntime({})

        this.name = name ?? this.name

        this.urlRewrites = urlRewrite ?? this.urlRewrites

        // ROUTIFY-DEV-ONLY-START
        this.log =
            this.log || this.instance.log.createChild(this.name || '[unnamed instance]')
        // ROUTIFY-DEV-ONLY-END

        // TODO not used. Deprecate?
        if (passthrough && !(passthrough instanceof Router))
            passthrough = this.parentCmpCtx?.route.router || passthrough

        this.passthrough = passthrough || this.passthrough

        // remove from old instance, in case the instance changed
        appInstance.instances.forEach(inst => {
            const index = inst.routers.indexOf(this)
            if (index !== -1) inst.routers.splice(index, 1)
        })
        // add to current instance
        this.instance.routers.push(this)

        if (routes && !this.rootNode) this.importRoutes(routes)

        /** @type {RNodeRuntime} */
        this.rootNode =
            rootNode ?? this.rootNode ?? this.instance.rootNodes[this.name || 'default']

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
        const route = get(this.pendingRoute) || get(this.activeRoute)
        url = url || route.url

        const result = this.urlRewrites.reduce(
            (_url, rewrite) => rewrite.toExternal(_url, { router: this }),
            url,
        )
        return result.replace(/\/index$/, '') // strip trailing index
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

        // todo move to Route.js
        url = url || '/'
        url = url.replace(/(.+)\/+([#?]|$)/, '$1$2') // strip trailing slashes

        // ROUTIFY-DEV-ONLY-START
        this.log.debug('set url', {
            url,
            mode,
            prev: this.url.internal(),
            browserOld: globalThis.document && urlFromAddress(),
            state,
        })
        // ROUTIFY-DEV-ONLY-END

        const currentRoute = this.pendingRoute.get() || this.activeRoute.get()

        if (!this.rootNode && this.instance.global.routeMaps[this.name])
            this.importRoutes(await this.instance.global.routeMaps[this.name]())

        const route = new Route(this, url, mode, state)

        const loadRoutePromise = route.loadRoute()
        if (state.prefetch) return

        if (identicalRoutes(currentRoute, route)) {
            this.log.debug('current route is identical - skip', currentRoute, route) // ROUTIFY-DEV-ONLY
            return false
        } else {
            route.log.debug('set pending route', route) // ROUTIFY-DEV-ONLY

            this.pendingRoute.set(route)
            const didLoadRoute = await loadRoutePromise
            // pending route could have changed while awaiting route.loadRoute() above
            if (this.pendingRoute.get() === route) this.pendingRoute.set(null)

            if (didLoadRoute) this.setActiveRoute(route)

            // TODO Wait a tick for component rendering. There's probably be a better way to handle this.
            await new Promise(resolve => setTimeout(resolve))

            return true
        }
    }

    setActiveRoute(route) {
        // the route made it through all pretasks, lets set it to active
        this.log.debug('set active route', this) // ROUTIFY-DEV-ONLY

        const $activeRoute = this.activeRoute.get()
        if ($activeRoute) this.history.push($activeRoute)

        this.activeRoute.set(route)

        this.afterUrlChange.run({
            route: route,
            history: [...this.history].reverse(),
        })

        Promise.all(
            route.fragments.map(fragment =>
                fragment.renderContext.then(rc => rc.mounted),
            ),
        ).then(() => this.afterRouteRendered.run({ route }))

        this.log.debug('unset pending route', this) // ROUTIFY-DEV-ONLY
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
