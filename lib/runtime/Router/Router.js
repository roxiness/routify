import { derived, get, writable } from 'svelte/store'
import { Route } from '#lib/runtime/Route/Route.js'
import { fromEntries, createHook } from '../utils.js'
import '#root/typedef.js'
import { createActiveUrlStore } from './utils.js'

/**
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
    /**
     * @param {RoutifyRuntime} instance
     * @param {Partial<RouterOptions>} param1
     */
    constructor(instance, { rootNode, parentCmpCtx, name } = {}) {
        instance.routers.push(this)
        this.instance = instance
        this.name = name || ''
        this.parentCmpCtx = parentCmpCtx
        this.rootNode = rootNode || instance.superNode.children[0]
        this.activeUrl = createActiveUrlStore(this)
        this.log = instance.log.child({ router: this, name: this.name })
        this.activeRoute = derived(
            this.activeUrl,
            $url => new Route(this, $url),
        )
        this.params = derived(
            this.activeRoute,
            $activeRoute => $activeRoute.params,
        )
        this.log.debug('created new router')

        // when internal url changes, reflect it in the address bar
        this.afterUrlChange((...params) => {
            const reflector = get(this.#urlReflector)
            if (reflector) reflector.reflect(...params)
        })
    }

    #urlReflector = writable(null)
    #offset = null
    urlTransforms = []
    beforeUrlChange = createHook()
    afterUrlChange = createHook()
    onDestroy = createHook()

    get offset() {
        return this.#offset
    }

    set offset(offset) {
        this.#offset = offset === true ? this.parentCmpCtx.node : offset
    }

    set url(url) {
        if (url) {
            this.log.debug('setting url on Router component:', url)
            this.activeUrl.replace(url, 'internal') //todo is causing probs
        }
    }

    get url() {
        return get(this.activeUrl).url
    }

    get urlReflector() {
        return this.#urlReflector
    }

    set urlReflector(urlReflector) {
        const reflector = get(this.#urlReflector)
        if (reflector) reflector.uninstall()
        this.#urlReflector.set(new urlReflector(this))
        console.log('')
        this.log.debug(`initialize router "${this.name}" with url from address`)
        get(this.#urlReflector).install()
    }

    queryHandler = {
        parse: search => fromEntries(new URLSearchParams(search)),
        stringify: params => '?' + new URLSearchParams(params).toString(),
    }

    destroy() {
        this.log.debug(`destroying router`)
        this.instance.routers = this.instance.routers.filter(
            router => router !== this,
        )
        this.onDestroy.hooks.forEach(hook => hook(this))
    }
}
