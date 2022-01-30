import { createSequenceHooksCollection } from 'hookar'
import { get } from 'svelte/store'
import { urlFromAddress } from '../../utils/index.js'
import { BaseReflector } from './ReflectorBase.js'

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

        this.absorb = () => router.url.replace(urlFromBrowser(router))
        this._pushstateHandler = createStateEventHandler('push')
        this._replacestateHandler = createStateEventHandler('replace')
        this._popstateHandler = () => router.url.pop(urlFromBrowser(router))
    }

    install() {
        this.hooks = [
            history['onPushstate'](this._pushstateHandler),
            history['onReplacestate'](this._replacestateHandler),
            history['onPopstate'](this._popstateHandler),
        ]

        if (!get(this.router.activeRoute)) this.absorb()
        else this.reflect()
    }

    uninstall() {
        this.hooks.forEach(unreg => unreg())
        setTimeout(() => this.reflect())
    }

    reflect = () => {
        const { mode } = get(this.router.activeRoute)
        if (mode === 'popState') return false
        const { routers, browserAdapter } = this.router.instance.global

        const addressRouters = routers.filter(
            router => router.urlReflector instanceof this.constructor,
        )

        const url = browserAdapter.toBrowser(addressRouters)

        // ROUTIFY-DEV-ONLY-START
        this.log.debug('pushing internal url to browser', {
            mode,
            url,
            currentBrowserUrl: urlFromAddress(),
            currentInternalUrl: this.router.url.internal(),
        })
        // ROUTIFY-DEV-ONLY-END

        history[`${mode}Native`]({}, '', url)
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
