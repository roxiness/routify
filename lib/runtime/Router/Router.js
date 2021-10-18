import { derived, get, writable } from 'svelte/store'
import { Route } from '../Route/Route.js'
import {
    fromEntries,
    createHook,
    urlFromAddress,
    getContextMaybe,
    getable,
    identicalRouteFragments,
} from '../utils/index.js'
import { BaseReflector } from './urlReflectors/ReflectorBase.js'
import { scrollHandler as sh } from '../plugins/scrollHandler/scrollHandler.js'
import { globalInstance } from '../Global/Global.js'
import { RoutifyRuntime } from '../Instance/RoutifyRuntime.js'

/**
 * @typedef {import('../utils/index.js').getable<Route>} RouteStore
 *
 *
 * @typedef {Object} RouterOptions
 * @prop {RoutifyRuntime} instance
 * @prop {RNodeRuntime} rootNode
 * @prop {any} routes
 * @prop {string} name
 * @prop {UrlRewrite|UrlRewrite[]} urlRewrite
 *
 * @typedef {Object} ParentCmpCtx
 * @prop {Route} route
 * @prop {RNodeRuntime} node
 * @prop {Object.<String|Number, String|Number>} localParams
 * @prop {Object.<String|Number, any>} options
 */

export class Router {
    /** @type {RouteStore} */
    pendingRoute = getable(null)
    /** @type {RouteStore} */
    activeRoute = getable(null)

    #urlReflectorStore = writable(new BaseReflector(this))

    /** @type {UrlRewrite[]} */
    urlRewrites = []

    beforeUrlChange = createHook()

    afterUrlChange = createHook()

    onDestroy = createHook()

    parentElem = null

    queryHandler = {
        parse: search => fromEntries(new URLSearchParams(search)),
        stringify: params => '?' + new URLSearchParams(params).toString(),
    }

    scrollHandler = sh

    url = {
        get: () => this.url.getPending() || this.url.getActive(),
        getActive: () => get(this.activeRoute)?.url,
        getPending: () => get(this.pendingRoute)?.url,
        toString: () => this.url.get(),
        external: { toString: () => this.getExternalUrl() },
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
        Object.assign(this, writable(this))

        this.init(options)
        this.params = derived(this.activeRoute, $activeRoute => $activeRoute.params)
        // we're using setTimeout to make sure outgoing routers have been destroyed
        // this also prevents the first router from absorbing the url from the address and
        // then reflecting only its internal url before other routers have absorbed the url
        this.afterUrlChange(() => setTimeout(get(this.#urlReflectorStore).reflect))
        this.afterUrlChange(this.scrollHandler.run)
        this.activeRoute.get = () => get(this.activeRoute)
        this.pendingRoute.get = () => get(this.pendingRoute)
    }

    /**
     * @param {Partial<RouterOptions>} param1
     */
    init({ instance, rootNode, name, routes, urlRewrite } = {}) {
        const parentCmpCtx = getContextMaybe('routify-fragment-context')
        this.urlRewrites = [urlRewrite].flat().filter(Boolean)
        this.instance =
            instance ||
            this.instance ||
            parentCmpCtx?.route.router.instance ||
            globalInstance.instances[0] ||
            new RoutifyRuntime({})

        globalInstance.instances.forEach(inst => {
            const index = inst.routers.indexOf(this)
            if (index !== -1) inst.routers.splice(index, 1)
        })

        this.instance.routers.push(this)

        if (routes) this.importRoutes(routes)

        this.name = name || ''
        this.parentCmpCtx = parentCmpCtx
        this.rootNode = rootNode || this.rootNode || this.instance.rootNodes.default

        // ROUTIFY-DEV-ONLY-START
        this.log =
            this.log || this.instance.log.createChild(this.name || '[unnamed instance]')
        // ROUTIFY-DEV-ONLY-END

        this.log.debug('created new router') // ROUTIFY-DEV-ONLY
        this.set(this)
        if (this.url.getActive()) this._setUrl(this.url.getActive(), 'pushState', true)
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
    getExternalUrl = url =>
        this.urlRewrites.reduce(
            (_url, rewrite) => rewrite.toExternal(_url, { router: this }),
            url || this.url.get(),
        )

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
        // ROUTIFY-DEV-ONLY-START
        const { debug, groupCollapsed, trace, groupEnd } = this.log

        if (this.log.level >= 4) {
            const info = { url, mode, prev: this.url.get(), browserOld: urlFromAddress() }
            ;[groupCollapsed('set url', info), trace(), groupEnd()]
        }
        // ROUTIFY-DEV-ONLY-END

        if (!url.startsWith('/')) url = url.replace(new URL(url).origin, '')

        const route = new Route(this, url, mode)

        if (identicalRouteFragments(get(activeRoute), route)) return true

        debug('set pending route', route) // ROUTIFY-DEV-ONLY
        pendingRoute.set(route)

        if (await route.runBeforeUrlChangeHooks()) {
            await route.loadComponents()
            if (await route.runGuards()) {
                await route.runPreloads()

                debug('set active route', route) // ROUTIFY-DEV-ONLY
                const oldRoute = get(activeRoute)
                activeRoute.set(route)
                if (oldRoute) this.history.push(oldRoute)
                const _history = [...this.history].reverse()
                this.afterUrlChange.hooks.forEach(hook => hook(activeRoute, _history))
            }
        }
        // unset pending route, if it hasn't changed since we started runBeforeUrlChangeHooks
        if (get(pendingRoute) === route) pendingRoute.set(null)
        return true
    }

    destroy() {
        this.log.debug(`destroying router`) // ROUTIFY-DEV-ONLY
        this.instance.routers = this.instance.routers.filter(router => router !== this)
        this.onDestroy.hooks.forEach(hook => hook(this))
    }

    /** @type {import('svelte/store').Writable<BaseReflector>} */
    get urlReflector() {
        return this.#urlReflectorStore
    }

    /** @param {typeof BaseReflector} UrlReflector */
    setUrlReflector(UrlReflector) {
        get(this.#urlReflectorStore).uninstall()
        this.#urlReflectorStore.set(new UrlReflector(this))
        get(this.#urlReflectorStore).install()
    }
}

/**
 * Creates a new router
 * @param  {Partial<RouterOptions>} options
 */
export const createRouter = options => new Router(options)
