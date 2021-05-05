import { derived, get, writable } from 'svelte/store'
import { Route } from './route/Route.js'
import { fromEntries, createHook } from './utils.js'
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
    beforeUrlChange = createHook()
    afterUrlChange = createHook()

    get offset() {
        return this.#offset
    }

    set offset(offset) {
        this.#offset = offset === true ? this.parentCmpCtx.node : offset
    }

    set url(url) {
        if (url) this.activeUrl.set({ url })
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

    applyUrlTransforms = url =>
        this.urlTransforms.reduce((u, { internal }) => internal(u), url)
}

const createActiveUrlStore = router => {
    const { set, subscribe } = writable({ url: '', mode: 'pushState' })
    const history = []

    return {
        /** @param {{url: string, mode?: 'pushState'|'replaceState', origin: 'internal'|'external'}} url */
        set: async url => {
            const lastEntry = history[history.length - 1]
            if (lastEntry && lastEntry.url === url.url) {
                console.log('returning', history)
                return false
            } else history.push(url)

            const oldValue = get({ subscribe })

            // beforeUrlChange
            for (const hook of router.beforeUrlChange.hooks) {
                const res = await hook(url, oldValue, router)
                if (!res) return false
            }
            set({
                url: url.url,
                mode: url.mode || 'pushState',
            })
            // afterUrlChange
            router.afterUrlChange.hooks.forEach(hook =>
                hook(url, oldValue, router),
            )
        },
        subscribe,
    }
}
