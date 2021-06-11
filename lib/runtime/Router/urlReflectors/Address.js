import '#root/typedef.js'
import { get } from 'svelte/store'
import { createHook } from '../../utils.js'

export class AddressReflector {
    /** @param {Router} router */
    constructor(router) {
        this.router = router
        const { activeUrl, instance, log, urlTransforms } = router
        const { browserAdapter, global } = instance
        const { urlFromBrowser } = global
        this.log = log

        if (!history.onPushstate) {
            this.log.debug('polyfill history hooks')
            polyfillHistory()
        }

        /** @param {('push'|'replace')} method */
        const createStateEventHandler = method => {
            return function (data, title, url) {
                const routerName = data.routify?.router ?? false

                if (routerName === false)
                    url = browserAdapter.toRouter(url, router)
                else if (routerName !== router.name) return false

                for (const transform of urlTransforms)
                    url = transform.toInternal(url)
                activeUrl[method](url)
            }
        }

        this.absorb = () => activeUrl.replace(urlFromBrowser(router.name))
        this._pushstateHandler = createStateEventHandler('push')
        this._replacestateHandler = createStateEventHandler('replace')
        this._popstateHandler = () => activeUrl.pop(urlFromBrowser(router.name))
    }

    // install hooks
    install() {
        this.hooks = [
            history['onPushstate'](this._pushstateHandler),
            history['onReplacestate'](this._replacestateHandler),
            history['onPopstate'](this._popstateHandler),
        ]

        if (this.router.url == null) this.absorb()
        else this.reflect({})
    }
    uninstall() {
        this.router.reflector = null
        this.hooks.forEach(unreg => unreg())
        setTimeout(() => this.reflect({}))
    }
    reflect = ({ mode = 'pushState' }) => {
        // on refresh each router may set its respective path from the address URL using browserAdapter.
        // Once set, the router will call reflect to make sure the address bar reflects the router's internal path.
        // if we set the address bar synchronously, only the first router will be reflected, hence we need setTimeout.
        if (mode === 'popState') return false
        this.log.debug('pushing internal url to browser', { mode })
        const { routers, browserAdapter } = this.router.instance.global

        const _routers = routers.filter(
            r => get(r.urlReflector).constructor.name === 'AddressReflector',
        )
        const browserUrl = browserAdapter.toBrowser(_routers)
        setTimeout(() => history[`${mode}Native`]({}, '', browserUrl))
    }
}

function polyfillHistory() {
    const hooks = {
        onPushstate: createHook(),
        onReplacestate: createHook(),
        onPopstate: createHook(),
    }
    Object.assign(history, hooks)

    const { pushState, replaceState } = history
    history['pushStateNative'] = pushState
    history['replaceStateNative'] = replaceState

    history.pushState = (data, title, url) => {
        for (const hook of hooks.onPushstate.hooks) hook(data, title, url)
    }
    history.replaceState = (data, title, url) => {
        for (const hook of hooks.onReplacestate.hooks) hook(data, title, url)
    }

    window.addEventListener('popstate', event => {
        for (const hook of hooks.onPopstate.hooks) hook(event)
    })

    return true
}
