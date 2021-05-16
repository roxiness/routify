import { get, writable } from 'svelte/store'

export const createActiveUrlStore = router => {
    const { set: _set, subscribe } = writable({ url: null, mode: 'pushState' })
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
        get: () => get({ subscribe }),
        subscribe,
    }
}
