import { derived, get, writable } from 'svelte/store'
import { Route } from './route/Route.js'
import { fromEntries, createGenericHook } from './utils.js'
import '../../typedef.js'

/**
 * @typedef {Object} RouterOptions
 * @prop {RNodeRuntime} rootNode
 * @prop {ParentCmpCtx} parentCmpCtx
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
    constructor(instance, { rootNode, parentCmpCtx } = {}) {
        this.instance = instance
        this.parentCmpCtx = parentCmpCtx
        this.rootNode = rootNode || instance.superNode.children[0]
        this.activeUrl = createActiveUrlStore(this)
        this.activeRoute = derived(
            this.activeUrl,
            $url => new Route(this, $url),
        )
        this.params = derived(
            this.activeRoute,
            $activeRoute => $activeRoute.params,
        )
    }

    #urlReflector = null
    #offset = null
    urlTransforms = []
    beforeUrlChange = createGenericHook()
    afterUrlChange = createGenericHook()

    get offset() {
        return this.#offset
    }

    set offset(offset) {
        this.#offset = offset === true ? -1 : offset
    }

    get urlReflector() {
        return this.#urlReflector
    }

    set urlReflector(urlReflector) {
        if (this.urlReflector) this.urlReflector.uninstall()
        this.#urlReflector = new urlReflector(this)
        this.#urlReflector.install()
    }

    queryHandler = {
        parse: search => fromEntries(new URLSearchParams(search)),
        stringify: params => '?' + new URLSearchParams(params).toString(),
    }
}

const createActiveUrlStore = router => {
    const { set, subscribe } = writable({ url: '', mode: 'pushState' })

    return {
        /** @param {{url: string, mode: 'pushState'|'replaceState'}} url */
        set: async url => {
            const oldValue = get({ subscribe })
            for (const hook of router.beforeUrlChange.hooks) {
                const res = await hook(url, oldValue, router)
                if (!res) return false
            }
            router.afterUrlChange.hooks.forEach(hook =>
                hook(url, oldValue, router),
            )
            set(url)
        },
        subscribe,
    }
}
