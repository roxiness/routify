import { writable } from 'svelte/store'

/**
 * writable with subscription hooks
 * @param {any} value
 */
export const writable2 = value => {
    let subscribers = []
    let { set, subscribe, update } = writable(value)

    const hooks = {
        onSub: () => {},
        onUnsub: () => {},
        onFirstSub: () => {},
        onLastUnsub: () => {},
    }

    const newSubscribe = (run, invalidator) => {
        // hooks
        hooks.onSub()
        if (!subscribers.length) hooks.onFirstSub()

        const unsub = subscribe(run, invalidator)
        subscribers.push(unsub)
        return () => {
            hooks.onUnsub()
            if (subscribers.length === 1) hooks.onLastUnsub()

            subscribers = subscribers.filter(_unsub => _unsub !== unsub)
            unsub()
        }
    }

    return {
        set,
        subscribe: newSubscribe,
        update,
        subscribers,
        hooks,
    }
}

export const isDescendantElem = parent => elem => {
    while ((elem = elem.parentNode)) if (elem === parent) return true
    return false
}

export const getUrlFromClick = boundaryElement => event => {
    if (!isDescendantElem(boundaryElement)(event.target)) return false

    const el = event.target.closest('a')
    const href = el && el.href

    if (
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.shiftKey ||
        event.button ||
        (event.key && event.key !== 'Enter') ||
        event.defaultPrevented
    )
        return
    if (!href || el.target || el.host !== location.host) return

    const url = new URL(href)
    const relativeUrl = url.pathname + url.search + url.hash

    event.preventDefault()
    return relativeUrl
}

const paramsFromPath = (pattern, path) => {
    const re = /\[(.+?)\]/gm
    const matches = pattern.match(re).map(name => name.slice(1, -1))
    if (!matches) return false

    const reStr = pattern.replace(re, '(.+)')
    const matches2 = path.match(new RegExp(reStr))
    if (!matches2) return false

    return matches.reduce((last, curr, index) => {
        last[curr] = matches2[index + 1]
        return last
    }, {})
}

console.log(paramsFromPath('a[slug]from[mug]', 'atitlefromme'))