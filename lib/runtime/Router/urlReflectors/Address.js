import { createSequenceHooksCollection } from 'hookar'
import { get } from 'svelte/store'
import { urlFromAddress } from '../../utils/index.js'
import { BaseReflector } from './ReflectorBase.js'

let reflectPending = false

export class AddressReflector extends BaseReflector {
    /** @param {Router} router */
    constructor(router) {
        super(router)
        const { instance, urlRewrites } = router
        const { urlFromBrowser, browserAdapter } = instance.global

        if (!history['onPushstate']) {
            this.log.debug('polyfill history hooks') // ROUTIFY-DEV-ONLY
            polyfillHistory()
        }

        /** @param {('push'|'replace')} method */
        const createStateEventHandler = method => {
            return function (data, title, url) {
                const routerName = data?.routify?.router ?? false

                if (routerName === false) url = browserAdapter.toRouter(url, router)
                else if (routerName !== router.name) return false
                for (const rewrite of urlRewrites)
                    url = rewrite.toInternal(url, { router })
                router.url[method](url)
            }
        }

        this.absorb = () => {
            const state = history.state?.routify?.router?.[router.name]
            router.url.replace(urlFromBrowser(router), state || {})
        }
        this._pushstateHandler = createStateEventHandler('push')
        this._replacestateHandler = createStateEventHandler('replace')
        this._popstateHandler = event =>
            router.url.pop(
                urlFromBrowser(router),
                event.state.routify?.router[router.name],
            )
    }

    install() {
        this.hooks = [
            history['onPushstate'](this._pushstateHandler),
            history['onReplacestate'](this._replacestateHandler),
            history['onPopstate'](this._popstateHandler),
        ]

        if (!this.router.activeRoute.get()) this.absorb()
        else this.reflect()
    }

    uninstall() {
        this.hooks.forEach(unreg => unreg())
        setTimeout(() => this.reflect())
    }

    reflect() {
        if (reflectPending) return
        reflectPending = true
        setTimeout(() => {
            reflectPending = false
            this._reflect()
        })
    }

    _reflect = () => {
        const { mode } = get(this.router.activeRoute)

        // todo ignoring popState should be optionable
        // if (mode === 'popState') return false

        const url = mode != 'popState' ? this._getRouterUrl() : null
        const state = this._createState()
        const method = mode === 'popState' ? 'replaceState' : mode

        // ROUTIFY-DEV-ONLY-START
        this.log.debug('pushing internal state to browser history', {
            mode,
            url,
            state,
            currentBrowserUrl: urlFromAddress(),
            currentInternalUrl: this.router.url.internal(),
        })
        // ROUTIFY-DEV-ONLY-END

        history[`${method}Native`](state, '', url)
    }

    _getRouterUrl() {
        const { routers, browserAdapter } = this.router.instance.global

        const sameInstance = router => router.urlReflector instanceof this.constructor
        const addressRouters = routers.filter(sameInstance)

        let url = browserAdapter.toBrowser(addressRouters) || '/'

        // coerce url to start with / if it doesn't start with / or #
        if (!/^(\/|#)/.test(url)) url = '/' + url
        return url
    }

    _createState() {
        // router state
        const routerState = { ...this.router.activeRoute.get()?.state }
        routerState.redirectedBy = routerState.redirectedBy?.url // avoid circular reference

        // history state
        const state = { ...history.state }
        state.routify = state.routify || { router: {} }
        state.routify.router[this.router.name] = routerState

        return state
    }
}

function polyfillHistory() {
    const hooks = {
        /** @type {import('hookar').HooksCollection<History['pushState']>} */
        onPushstate: createSequenceHooksCollection(),
        /** @type {import('hookar').HooksCollection<History['replaceState']>} */
        onReplacestate: createSequenceHooksCollection(),
        onPopstate: createSequenceHooksCollection(),
    }
    Object.assign(history, hooks)

    // backup native methods
    const { pushState, replaceState } = history
    history['pushStateNative'] = pushState
    history['replaceStateNative'] = replaceState

    history.pushState = hooks.onPushstate.run
    history.replaceState = hooks.onReplacestate.run
    window.addEventListener('popstate', hooks.onPopstate.run)

    return true
}
