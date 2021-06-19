import { derived, get, writable } from 'svelte/store'
import { Route } from '#lib/runtime/Route/Route.js'
import { fromEntries, createHook } from '../utils.js'
import '#root/typedef.js'
import { BaseReflector } from './urlReflectors/ReflectorBase.js'

/**
 * @typedef {import('svelte/store').Writable<Route>} RouteStore
 *
 * @typedef {Object} RouterOptions
 * @prop {RNodeRuntime} rootNode
 * @prop {ParentCmpCtx} parentCmpCtx
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

    #offset = null

    urlTransforms = []

    beforeUrlChange = createHook()

    afterUrlChange = createHook()

    onDestroy = createHook()

    queryHandler = {
        parse: search => fromEntries(new URLSearchParams(search)),
        stringify: params => '?' + new URLSearchParams(params).toString(),
    }

    url = {
        set: this._setUrl,
        get: () => get(this.activeRoute).url,
        push: url => this._setUrl(url, 'pushState'),
        replace: url => this._setUrl(url, 'replaceState'),
        pop: url => this._setUrl(url, 'popState'),
        toString: () => get(this.activeRoute)?.url,
    }

    /**
     * @param {RoutifyRuntime} instance
     * @param {Partial<RouterOptions>} param1
     */
    constructor(instance, { rootNode, parentCmpCtx, name } = {}) {
        this.afterUrlChange(route => {
            const reflector = get(this.#urlReflectorStore)
            if (reflector) reflector.reflect(route)
        })
        instance.routers.push(this)
        this.instance = instance
        this.name = name || ''
        this.parentCmpCtx = parentCmpCtx
        this.rootNode = rootNode || instance.superNode.children[0]
        this.log = instance.log.child({ router: this, name: this.name })
        this.params = derived(this.activeRoute, $activeRoute => $activeRoute.params)
        this.log.debug('created new router')

        // when internal url changes, reflect it in the address bar
    }

    /**
     *
     * @param {string} url
     * @param {UrlState} mode
     * @returns
     */
    async _setUrl(url, mode) {
        const history = []
        const debug = this.log.debug.bind(this.log)
        const { activeRoute, pendingRoute } = this
        debug('set url', url, mode)
        const lastEntry = history[history.length - 1]
        if (lastEntry && lastEntry.url === url) return false

        const route = new Route(this, url, mode)
        const oldRoute = get(activeRoute)

        debug('set pending route', route)
        pendingRoute.set(route)

        if (await route.runBeforeUrlChangeHooks()) {
            debug('load components', route)
            await route.loadComponents()
            debug('run guards', route)
            if (await route.runGuards()) {
                debug('run preloads', route)
                await route.runPreloads()

                debug('set active route', route)
                activeRoute.set(route)
                history.push(oldRoute)
                this.afterUrlChange.hooks.forEach(hook => hook(activeRoute))
            }
        }
        pendingRoute.set(null)
    }

    destroy() {
        this.log.debug(`destroying router`)
        this.instance.routers = this.instance.routers.filter(router => router !== this)
        this.onDestroy.hooks.forEach(hook => hook(this))
    }

    get offset() {
        return this.#offset
    }

    set offset(offset) {
        this.#offset = offset === true ? this.parentCmpCtx.node : offset
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
