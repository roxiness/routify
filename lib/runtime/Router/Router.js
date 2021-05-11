import { derived, get, writable } from 'svelte/store'
import { Route } from '#lib/runtime/Route/Route.js'
import { fromEntries, createHook, autoIncrementer } from '../utils.js'
import '#root/typedef.js'

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
        this.name = createName(parentCmpCtx)
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
        if (url) {
            this.log.debug('setting url on Router component:', url)
            this.activeUrl.replace(url, 'internal') //todo is causing probs
        }
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
    const { set: _set, subscribe } = writable({ url: '', mode: 'pushState' })
    const modes = ['pushState', 'replaceState', 'popState']
    const history = []

    /** @param {{url: string, mode: 'pushState'|'replaceState'|'popState', origin: 'internal'|'address'}} url */
    const set = async (url, mode, origin) => {
        if (!origin) throw new Error('url must have origin')
        if (!modes.includes(mode))
            throw new Error(
                'url.mode must be pushState, replaceState or popState',
            )
        const lastEntry = history[history.length - 1]
        if (lastEntry && lastEntry.url === url) return false

        const urlObj = { url, mode, origin }
        history.push(urlObj)

        const oldValue = get({ subscribe })

        // beforeUrlChange
        for (const hook of router.beforeUrlChange.hooks) {
            const res = await hook(urlObj, oldValue, router)
            if (!res) return false
        }

        router.log.debug('activeUrl.set', urlObj)
        _set(urlObj)

        // afterUrlChange
        router.afterUrlChange.hooks.forEach(hook =>
            hook(urlObj, oldValue, router),
        )
    }

    return {
        set,
        push: (url, origin) => set(url, 'pushState', origin),
        replace: (url, origin) => set(url, 'replaceState', origin),
        pop: (url, origin) => set(url, 'popState', origin),
        subscribe,
    }
}

const createName = ctx =>
    [
        (ctx && ctx.node.id) || null,
        'router',
        autoIncrementer(ctx, '_routerCount'),
    ]
        .filter(Boolean)
        .join('-')
