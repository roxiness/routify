import '#root/typedef.js'
import { createHook } from '../../utils.js'

export class AddressReflector {
    /** @param {Router} router */
    constructor(router) {
        this.router = router
        this.log = this.router.log

        if (!history.onPushstate) {
            this.log.debug('polyfill history hooks')
            polyfillHistory()
        }
    }

    /** @param {('push'|'replace')} method */
    _createAlterStateHook(method) {
        const { browserAdapter } = this.router.instance.global
        const { activeUrl } = this.router

        return function (data, title, url) {
            const routerName = data.routify?.router ?? false

            if (routerName === false)
                url = browserAdapter.toRouter(url, this.router)
            else if (routerName !== this.router.name) return false

            for (const transform of this.router.urlTransforms)
                url = transform.toInternal(url)
            activeUrl[method](url, 'address')
        }
    }

    install() {
        const { urlFromBrowser, browserAdapter } = this.router.instance.global

        this.router.reflector = 'address'

        // install hooks
        const { activeUrl } = this.router

        const hooks = [
            history['onPushstate'](this._createAlterStateHook('push')),
            history['onReplacestate'](this._createAlterStateHook('replace')),
            history['onPopstate'](() => {
                activeUrl.pop(urlFromBrowser(this.router.name), 'address')
            }),
            // when internal url changes, reflect it in the address bar
            this.router.afterUrlChange(this.reflect.bind(this)),
            this.router.onDestroy(() =>
                this.reflect.bind(this)({ mode: 'replaceState' }),
            ),
        ]

        console.log('')
        this.log.debug(
            `initialize router "${this.router.name}" with url from address`,
        )
        activeUrl.replace(urlFromBrowser(this.router.name), 'address')

        this.unregisterHooks = hooks
    }
    uninstall() {
        this.router.reflector = null
        this.unregisterHooks.forEach(unreg => unreg())
    }
    reflect({ mode = 'pushState', origin }) {
        if (mode === 'popState') return false
        this.log.debug('pushing internal url to browser', { mode, origin })
        const { routers, browserAdapter } = this.router.instance.global

        const _routers = routers.filter(r => r.reflector === 'address')
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
