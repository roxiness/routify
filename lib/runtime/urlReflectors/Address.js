import { get } from 'svelte/store'
import '../../../typedef.js'

export class AddressReflector {
    /** @param {Router} router */
    constructor(router) {
        this.router = router
    }
    install() {
        // install event listeners
        const { urlTransforms, activeUrl } = this.router
        if (!history['pushStateNative']) {
            history['pushStateNative'] = history.pushState
            history['replaceStateNative'] = history.replaceState
        }
        history.pushState = (data, title, url) => {
            history['pushStateNative'](data, title, url)
            url = urlTransforms.reduce((u, { internal }) => internal(u), url)
            activeUrl.set({ url, mode: 'pushState' })
        }

        history.replaceState = (data, title, url) => {
            history['replaceStateNative'](data, title, url)
            url = urlTransforms.reduce((u, { internal }) => internal(u), url)
            activeUrl.set({ url, mode: 'replaceState' })
        }

        const { pathname, search, hash } = window.location
        activeUrl.set({ url: pathname + search + hash })

        // set url in address to current activeUrl
        this.unhook = this.router.afterUrlChange(this.reflect.bind(this))
    }
    uninstall() {
        history.pushState = history['pushStateNative']
        history.replaceState = history['replaceStateNative']
        this.unhook()
    }
    reflect({ url, mode = 'pushState' }) {
        // apply each urlTransform.external
        const { urlTransforms } = this.router
        url = urlTransforms.reduce((url, { external }) => external(url), url)
        history[`${mode}Native`]({ _origin: 'routify' }, '', url)
    }
}
