import { derived, get, writable } from 'svelte/store'
import { Route } from '../Route/Route.js'
import {
    fromEntries,
    createHook,
    urlFromAddress,
    getContextMaybe,
} from '../utils/index.js'
import { BaseReflector } from './urlReflectors/ReflectorBase.js'
import { scrollHandler as sh } from '../plugins/scrollHandler/scrollHandler.js'
import { globalInstance } from '../Global/Global.js'
import { RoutifyRuntime } from '../Instance/RoutifyRuntime.js'

/**
 * @typedef {import('svelte/store').Writable<Route>} RouteStore
 *
 * @typedef {Object} RouterOptions
 * @prop {RoutifyRuntime} instance
 * @prop {RNodeRuntime} rootNode
 * @prop {any} routes
 * @prop {string} name
 *
 * @typedef {Object} ParentCmpCtx
 * @prop {Route} route
 * @prop {RNodeRuntime} node
 * @prop {Object.<String|Number, String|Number>} localParams
 * @prop {Object.<String|Number, any>} options
 */

export class Router {
    /** @type {RouteStore} */
    pendingRoute = writable(null)
    /** @type {RouteStore} */
    activeRoute = writable(null)

    #urlReflectorStore = writable(new BaseReflector(this))

    urlTransforms = []

    beforeUrlChange = createHook()

    afterUrlChange = createHook()

    onDestroy = createHook()

    parentElem = null

    queryHandler = {
        parse: search => fromEntries(new URLSearchParams(search)),
        stringify: params => '?' + new URLSearchParams(params).toString(),
    }

    url = {
        set: this._setUrl,
        getActive: () => get(this.activeRoute)?.url,
        getPending: () => get(this.pendingRoute)?.url,
        get: () => this.url.getPending() || this.url.getActive(),
        push: url => this._setUrl(url, 'pushState'),
        replace: url => this._setUrl(url, 'replaceState'),
        pop: url => this._setUrl(url, 'popState'),
        toString: () => get(this.activeRoute)?.url,
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
     * @param {Partial<RouterOptions>} param1
     */
    constructor({ instance, rootNode, name, routes } = {}) {
        const parentCmpCtx = getContextMaybe('routify-fragment-context')
        if (!instance)
            instance =
                parentCmpCtx?.route.router.instance ||
                globalInstance.instances[0] ||
                new RoutifyRuntime({})

        if (routes) instance.superNode.importTree(routes)
        this.instance = instance

        instance.routers.push(this)
        this.instance = instance
        this.name = name || ''
        this.parentCmpCtx = parentCmpCtx
        this.rootNode = rootNode || instance.superNode.children[0]
        // ROUTIFY-DEV-ONLY-START
        this.log = instance.log.createChild(this.name || '[unnamed instance]')
        // ROUTIFY-DEV-ONLY-END
        this.params = derived(this.activeRoute, $activeRoute => $activeRoute.params)

        // we're using setTimeout to make sure outgoing routers have been destroyed
        // this also prevents the first router from absorbing the url from the address and
        // then reflecting only its internal url before other routers have absorbed the url
        this.afterUrlChange(() => setTimeout(get(this.#urlReflectorStore).reflect))
        this.afterUrlChange(this.scrollHandler.run)
        this.log.debug('created new router') // ROUTIFY-DEV-ONLY

        this.activeRoute.get = () => get(this.activeRoute)
        this.pendingRoute.get = () => get(this.pendingRoute)
    }

    scrollHandler = sh

    /**
     *
     * @param {string} url
     * @param {UrlState} mode
     * @returns {Promise<true|false>}
     */
    async _setUrl(url, mode) {
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

        if (get(activeRoute)?.url === route?.url) return true

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
    set urlReflector(UrlReflector) {
        get(this.#urlReflectorStore).uninstall()
        this.#urlReflectorStore.set(new UrlReflector(this))
        get(this.#urlReflectorStore).install()
    }
}

/**
 * Creates a new router
 * @param  {RouterOptions} options
 */
export const createRouter = options => new Router(options)
