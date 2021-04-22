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

const defaultRe = /\[(.+?)\]/gm
export const createInstanceUtils = (RE = defaultRe) => ({
    /**
     * returns ["slug", "id"] from "my[slug]and[id]"
     * @param {string} name
     * @returns {string[]}
     */
    getFieldsFromName: name => [...name.matchAll(RE)].map(v => v[1]),

    /**
     * converts "my[slug]and[id]" to /my(.+)and(.+)/gm
     * @param {string} name
     * @returns {RegExp}
     */
    getRegexFromName: name => new RegExp(name.replace(RE, '(.+)')),

    /**
     * returns an array of values matching a regular expresion and path
     * @param {RegExp} re
     * @param {string} path
     * @returns {string[]}
     */
    getValuesFromPath: (re, path) => (path.match(re) || []).slice(1),

    /**
     * converts (['a', 'b', 'c'], [1, 2, 3]) to {a: 1, b: 2, c: 3}
     * @param {string[]} fields
     * @param {string[]} values
     * @returns
     */
    mapFieldsWithValues: (fields, values) =>
        haveEqualLength(fields, values) &&
        fields.reduce((map, field, index) => {
            map[field] = values[index]
            return map
        }, {}),
})

const haveEqualLength = (fields, values) => {
    if (fields.length !== values.length)
        throw new Error(
            'fields and values should be of same length' +
                `\nfields: ${JSON.stringify(fields)}` +
                `\nvalues: ${JSON.stringify(values)}`,
        )
    return true
}
