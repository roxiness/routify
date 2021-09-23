import '../../../../typedef.js'
import { get } from 'svelte/store'
import { createHook, urlFromAddress } from '../../utils/index.js'
import { BaseReflector } from './ReflectorBase.js'

export class AddressReflector extends BaseReflector {
    /** @param {Router} router */
    constructor(router) {
        super(router)
        const { instance, urlTransforms } = router
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

                for (const transform of urlTransforms) url = transform.toInternal(url)
                router.url[method](url)
            }
        }

        this.absorb = () => router.url.replace(urlFromBrowser(router.name))
        this._pushstateHandler = createStateEventHandler('push')
        this._replacestateHandler = createStateEventHandler('replace')
        this._popstateHandler = () => router.url.pop(urlFromBrowser(router.name))
    }

    install() {
        this.hooks = [
            history['onPushstate'](this._pushstateHandler),
            history['onReplacestate'](this._replacestateHandler),
            history['onPopstate'](this._popstateHandler),
        ]

        if (!get(this.router.activeRoute)) this.absorb()
        else this.reflect({})
    }

    uninstall() {
        this.hooks.forEach(unreg => unreg())
        setTimeout(() => this.reflect({}))
    }

    reflect = () => {
        const { mode } = get(this.router.activeRoute)
        if (mode === 'popState') return false
        const { routers, browserAdapter } = this.router.instance.global

        const addressRouters = routers.filter(
            router => get(router.urlReflector) instanceof this.constructor,
        )

        const url = browserAdapter.toBrowser(addressRouters)

        // ROUTIFY-DEV-ONLY-START
        this.log.debug('pushing internal url to browser', {
            mode,
            url,
            currentBrowserUrl: urlFromAddress(),
            currentInternalUrl: this.router.url.get(),
        })
        // ROUTIFY-DEV-ONLY-END

        history[`${mode}Native`]({}, '', url)
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
