import { get } from 'svelte/store'
import '../../../typedef.js'
import { createHook } from '../utils.js'

export class AddressReflector {
    /** @param {Router} router */
    constructor(router) {
        this.router = router

        installHooks()
    }
    install() {
        // install event listeners
        const { applyUrlTransforms, activeUrl } = this.router

        this.unregisterHooks = [
            history.onPushstate((data, title, url) => {
                url = applyUrlTransforms(url)
                activeUrl.set({ url, mode: 'pushState', origin: 'external' })
            }),
            history.onReplacestate((data, title, url) => {
                url = applyUrlTransforms(url)
                activeUrl.set({ url, mode: 'replaceState', origin: 'external' })
            }),
            // when internal url changes, reflect it in the address bar
            this.router.afterUrlChange(this.reflect.bind(this)),
        ]

        const { pathname, search, hash } = window.location
        activeUrl.set({ url: pathname + search + hash })
    }
    uninstall() {
        this.unregisterHooks.forEach(unreg => unreg())
    }
    reflect({ url, mode = 'pushState' }) {
        // apply each urlTransform.external
        const { urlTransforms } = this.router
        url = urlTransforms.reduce((url, { external }) => external(url), url)

        history[mode]({ _origin: 'routify' }, '', url)
    }
}

let installedHistoryHooks = false
function installHooks() {
    if (installedHistoryHooks) return false
    installedHistoryHooks = true

    const hooks = {
        onPushstate: createHook(),
        onReplacestate: createHook(),
        onPopstate: createHook(),
    }

    const { pushState, replaceState } = history

    history.pushState = (data, title, url) => {
        for (const hook of hooks.onPushstate.hooks) hook(data, title, url)
        pushState.bind(history)(data, title, url)
    }
    history.replaceState = (data, title, url) => {
        for (const hook of hooks.onReplacestate.hooks) hook(data, title, url)
        replaceState.bind(history)(data, title, url)
    }

    window.addEventListener('popstate', event => {
        for (const hook of hooks.onReplacestate.hooks) hook(event)
    })

    Object.assign(history, hooks)
    return true
}
