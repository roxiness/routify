import '#root/typedef.js'
import { createHook, urlFromAddress } from '../utils.js'

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
    install() {
        const { urlFromBrowser } = this.router.instance.global

        this.router.reflector = 'address'

        // install hooks
        const { applyUrlTransforms, activeUrl } = this.router

        const hooks = [
            history['onPushstate']((data, title, url) => {
                if (!data.updateRoutify) return false
                url = url = applyUrlTransforms(url)
                activeUrl.push(url, 'address')
            }),
            history['onReplacestate']((data, title, url) => {
                if (!data.updateRoutify) return false
                url = applyUrlTransforms(url)
                activeUrl.replace(url, 'address')
            }),
            history['onPopstate'](() => {
                activeUrl.pop(urlFromBrowser(this.router.name), 'address')
            }),
            // when internal url changes, reflect it in the address bar
            this.router.afterUrlChange(this.reflect.bind(this)),
            this.router.onDestroy(() =>
                this.reflect.bind(this)({ mode: 'replaceState' }),
            ),
        ]

        this.log.debug(`initialize router with url from address`)
        activeUrl.replace(urlFromBrowser(this.router.name), 'address')

        this.unregisterHooks = hooks
    }
    uninstall() {
        this.router.reflector = null
        this.unregisterHooks.forEach(unreg => unreg())
    }
    reflect({ mode = 'pushState', origin }) {
        this.log.debug('pushing internal url to browser', { mode, origin })
        if (origin !== 'address') {
            const { routers, browserAdapter } = this.router.instance.global

            const _routers = routers
                .filter(router => (router.reflector = 'address'))
                .map(router => ({ ...router, url: router.activeUrl.get().url }))
            const browserUrl = browserAdapter.toBrowser(_routers)
            history[`${mode}Native`]({ _origin: 'routify' }, '', browserUrl)
        }
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
        pushState.bind(history)(data, title, url)
    }
    history.replaceState = (data, title, url) => {
        for (const hook of hooks.onReplacestate.hooks) hook(data, title, url)
        replaceState.bind(history)(data, title, url)
    }

    window.addEventListener('popstate', event => {
        for (const hook of hooks.onPopstate.hooks) hook(event)
    })

    return true
}
