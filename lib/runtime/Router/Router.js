import { derived, get, writable } from 'svelte/store'
import { Route } from '#lib/runtime/Route/Route.js'
import { fromEntries, createHook } from '../utils.js'
import '#root/typedef.js'
import { BaseReflector } from './urlReflectors/ReflectorBase.js'
import { resolveNode } from '../helpers/index.js'
import { scrollHandler } from '../plugins/scrollHandler/scrollHandler.js'

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
     * @param {RoutifyRuntime} instance
     * @param {Partial<RouterOptions>} param1
     */
    constructor(instance, { rootNode, parentCmpCtx, name, scrollHandler } = {}) {
        instance.routers.push(this)
        this.instance = instance
        this.name = name || ''
        this.parentCmpCtx = parentCmpCtx
        this.rootNode = rootNode || instance.superNode.children[0]
        this.log = instance.log.create({
            defaults: {
                additional: this.name,
                message: this.name,
            },
        })
        this.params = derived(this.activeRoute, $activeRoute => $activeRoute.params)

        // we're using setTimeout to make sure outgoing routers have been destroyed
        // this also prevents the first router from absorbing the url from the address and
        // then reflecting only its internal url before other routers have absorbed the url
        this.afterUrlChange(() => setTimeout(get(this.#urlReflectorStore).reflect))
        this.afterUrlChange(this.scrollHandler.run)
        this.log.debug('created new router')
    }

    scrollHandler = scrollHandler

    /**
     *
     * @param {string} url
     * @param {UrlState} mode
     * @returns {Promise<true|false>}
     */
    async _setUrl(url, mode) {
        url = url || '/'
        const debug = this.log.debug.bind(this.log)
        const { activeRoute, pendingRoute } = this
        debug('set url', url, mode)

        if (!url.startsWith('/')) url = url.replace(new URL(url).origin, '')

        const route = new Route(this, url, mode)

        if (get(activeRoute)?.url === route?.url) return false

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
                const oldRoute = get(activeRoute)
                activeRoute.set(route)
                if (oldRoute) this.history.push(oldRoute)
                const _history = [...this.history].reverse()
                this.afterUrlChange.hooks.forEach(hook => hook(activeRoute, _history))
            }
        }
        pendingRoute.set(null)
        return true
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
        this.#offset =
            typeof offset === 'string'
                ? resolveNode(offset)
                : offset || this.parentCmpCtx.node
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
