/**
 * @template T
 * @typedef { import('svelte/store').Readable } Readable<T>
 */

/**
 * @typedef { import('../utils/index.js').Getable<Route> } RouteStore
 */

/**
 * @typedef { function({router: Router, firstInit: Boolean}): any } RouterInitCallback
 * @typedef { function({route: Route}): any } BeforeUrlChangeCallback
 * @typedef { function({
 *   route: Route,
 *   history: Route[]
 * }): any } AfterUrlChangeCallback
 * @typedef { function(RouteFragment[]):RouteFragment[] } TransformFragmentsCallback
 * @typedef { function({router: typeof this}):void } OnDestroyRouterCallback
 */

/**
 * @typedef { Object } RouterOptions
 * @prop { RoutifyRuntime } instance instance to use. Uses global by default
 * @prop { RNodeRuntime } rootNode
 * @prop { any } routes the routes tree
 * @prop { string } name name of router - leave blank if only only one router is used
 * @prop { UrlRewrite|UrlRewrite[] } urlRewrite hook: transforms paths to and from router and browser
 * @prop { typeof BaseReflector } urlReflector where to store the URL state - browser by default
 * @prop { string= } url initial url - "/" by default
 * @prop { Boolean| typeof Router } passthrough ignore clicks
 * @prop { MaybeArray<RouterInitCallback> } beforeRouterInit hook: runs before each router initiation
 * @prop { MaybeArray<RouterInitCallback> } afterRouterInit hook: runs after each router initiation
 * @prop { MaybeArray<BeforeUrlChangeCallback> } beforeUrlChange hook: guard that runs before url changes
 * @prop { MaybeArray<AfterUrlChangeCallback> } afterUrlChange hook: runs after url has changed
 * @prop { MaybeArray<TransformFragmentsCallback> } transformFragments hook: transform route fragments after navigation
 * @prop { MaybeArray<OnDestroyRouterCallback> } onDestroy hook: runs before router is destroyed
 * @prop { RouterOptions[] } plugins
 */

/**
 * @typedef { Object } ParentCmpCtx
 * @prop { Route } route
 * @prop { RNodeRuntime } node
 * @prop { Object.<String|Number, String|Number> } localParams
 * @prop { Object.<String|Number, any> } options
 */

/**
 * @typedef { Object } RouterOptionsNormalizedOverlay
 * @prop { UrlRewrite[] } urlRewrite hook: transforms paths to and from router and browser
 * @prop { RouterInitCallback[] } beforeRouterInit hook: runs before each router initiation
 * @prop { RouterInitCallback[] } afterRouterInit hook: runs after each router initiation
 * @prop { BeforeUrlChangeCallback[] } beforeUrlChange hook: guard that runs before url changes
 * @prop { AfterUrlChangeCallback[] } afterUrlChange hook: runs after url has changed
 * @prop { TransformFragmentsCallback[] } transformFragments hook: transform route fragments after navigation
 * @prop { OnDestroyRouterCallback[] } onDestroy hook: runs before router is destroyed
 */

/**
 * @typedef { RouterOptions & RouterOptionsNormalizedOverlay } RouterOptionsNormalized
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
import { scrollHandler as sh } from '../plugins/scrollHandler/scrollHandler.js'
import { globalInstance } from '../Global/Global.js'
import { RoutifyRuntime } from '../Instance/RoutifyRuntime.js'
import { AddressReflector } from './urlReflectors/Address.js'
import { InternalReflector } from './urlReflectors/Internal.js'
import {
    createGuardsCollection,
    createPipelineCollection,
    createSequenceHooksCollection,
} from 'hookar'

// todo move stripNullFields and normalizeRouterOptions to utils file.
const stripNullFields = obj =>
    Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null))

/**
 * merges options.plugin into options
 * @param {Partial<RouterOptions>} options
 * @param {Partial<RouterOptionsNormalized>=} config
 */
const normalizeRouterOptions = (options, config) => {
    config = config || {
        name: '',
        beforeRouterInit: [],
        afterRouterInit: [],
        urlRewrite: [],
        beforeUrlChange: [],
        afterUrlChange: [],
        transformFragments: [],
        onDestroy: [],
    }

    // separate plugins and options
    const { plugins, ...optionsOnly } = options
    const optionsGroups = [...(plugins || []), optionsOnly]
    optionsGroups.forEach(pluginOptions => {
        if ('plugin' in pluginOptions) normalizeRouterOptions(pluginOptions, config)

        Object.entries(pluginOptions).forEach(([field, value]) => {
            if (Array.isArray(config[field]))
                config[field].push(...[value].flat().filter(Boolean))
            else config[field] = value || config[field]
        })
    })
    return config
}

/**
 * @implements { Readable<Router> }
 */
export class Router {
    /** @type { RouteStore } */
    pendingRoute = getable(null)
    /** @type { RouteStore } */
    activeRoute = getable(null)

    #urlReflector = null

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

    queryHandler = {
        parse: search => fromEntries(new URLSearchParams(search)),
        stringify: params => '?' + new URLSearchParams(params).toString(),
    }

    scrollHandler = sh

    url = {
        internal: () => this.url.getPending() || this.url.getActive(),
        external: () => this.getExternalUrl(),
        getActive: () => get(this.activeRoute)?.url,
        getPending: () => get(this.pendingRoute)?.url,
        toString: () => this.url.internal(),
        set: this._setUrl,
        push: url => this._setUrl(url, 'pushState'),
        replace: url => this._setUrl(url, 'replaceState'),
        pop: url => this._setUrl(url, 'popState'),
    }

    ready = (() =>
        new Promise(resolve => {
            let unsub
            unsub = this.activeRoute.subscribe(route => {
                if (route) resolve()
                if (unsub) unsub()
            })
        }))()

    /** @type {Route[]} */
    history = []

    /**
     * @param {Partial<RouterOptions>} options
     */
    constructor(options) {
        const { subscribe, set } = writable(this)
        this.subscribe = subscribe
        this.triggerStore = () => set(this)

        this.init(options)
        this.params = derived(this.activeRoute, $activeRoute => $activeRoute.params)
        // we're using setTimeout to make sure outgoing routers have been destroyed
        // this also prevents the first router from absorbing the url from the address and
        // then reflecting only its internal url before other routers have absorbed the url
        this.afterUrlChange(() => setTimeout(() => this.#urlReflector.reflect()))
        this.afterUrlChange(this.scrollHandler.run)
        this.activeRoute.get = () => get(this.activeRoute)
        this.pendingRoute.get = () => get(this.pendingRoute)
    }

    /**
     * @param {Partial<RouterOptions>} input
     */
    init(input) {
        const firstInit = !this.options

        // we need to strip undefine / null fields since they would overwrite existing options
        input = stripNullFields(input)
        /** @type {Partial<RouterOptionsNormalized>} */
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
        } = this.options

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
            globalInstance.instances[0] ||
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

        globalInstance.instances.forEach(inst => {
            const index = inst.routers.indexOf(this)
            if (index !== -1) inst.routers.splice(index, 1)
        })

        this.instance.routers.push(this)

        if (routes) this.importRoutes(routes)

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

    setParentElem = elem => (this.parentElem = elem)

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
     * @returns {Promise<true|false>}
     */
    async _setUrl(url, mode, isInternal) {
        if (!isInternal) url = this.getInternalUrl(url)

        url = url || '/'
        url = url.replace(/(.+)\/+([#?]|$)/, '$1$2') // strip trailing slashes
        const { activeRoute, pendingRoute } = this
        const $activeRoute = activeRoute.get()

        // ROUTIFY-DEV-ONLY-START
        const { debug, groupCollapsed, trace, groupEnd } = this.log
        if (this.log.level >= 4) {
            const info = {
                url,
                mode,
                prev: this.url.internal(),
                browserOld: urlFromAddress(),
            }
            ;[groupCollapsed('set url', info), trace(), groupEnd()]
        }
        // ROUTIFY-DEV-ONLY-END

        if (!url.startsWith('/')) url = url.replace(new URL(url).origin, '')

        const route = new Route(this, url, mode)

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
        return this.#urlReflector
    }

    /** @param {typeof BaseReflector} UrlReflector */
    setUrlReflector(UrlReflector) {
        this.#urlReflector?.uninstall()
        this.#urlReflector = new UrlReflector(this)
        this.#urlReflector.install()
        this.triggerStore()
    }
}

/**
 * Creates a new router
 * @param  {Partial<RouterOptions>} options
 */
export const createRouter = options => new Router(options)
