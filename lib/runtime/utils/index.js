import { get, writable } from 'svelte/store'
import { getContext } from 'svelte'
export * from './logger.js' // ROUTIFY-DEV-ONLY

// /**
//  * writable with subscription hooks
//  * @param {any} value
//  */
// export const writable2 = value => {
//     let subscribers = []
//     let { set, subscribe, update } = writable(value)

//     const hooks = {
//         onSub: () => {},
//         onUnsub: () => {},
//         onFirstSub: () => {},
//         onLastUnsub: () => {},
//     }

//     const newSubscribe = (run, invalidator) => {
//         // hooks
//         hooks.onSub()
//         if (!subscribers.length) hooks.onFirstSub()

//         const unsub = subscribe(run, invalidator)
//         subscribers.push(unsub)
//         return () => {
//             hooks.onUnsub()
//             if (subscribers.length === 1) hooks.onLastUnsub()

//             subscribers = subscribers.filter(_unsub => _unsub !== unsub)
//             unsub()
//         }
//     }

//     return {
//         set,
//         subscribe: newSubscribe,
//         update,
//         subscribers,
//         hooks,
//     }
// }

export const isDescendantElem = parent => elem => {
    while ((elem = elem.parentNode)) if (elem === parent) return true
    return false
}

export const getUrlFromClick = event => {
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

// TODO ADD TEST
/**
 *
 * @param {string} path
 * @param {Object.<string|number,string|number>} params
 * @param {function} queryHandler
 * @returns {string}
 */
export const pathAndParamsToUrl = (path, params = {}, queryHandler) => {
    Object.entries(params).forEach(([key, val]) => {
        if (path.includes(`[${key}]`)) {
            path = path.replace(`[${key}]`, val)
            delete params[key]
        }
    })

    return path + queryHandler(params)
}

export const fromEntries = iterable => {
    return [...iterable].reduce((obj, [key, val]) => {
        obj[key] = val
        return obj
    }, {})
}

/**
 *
 * @param {string} path
 * @param {Object.<string,string>} params
 * @param {Route} route
 * @returns
 */
export const populateUrl = (path, params, route) => {
    /** @type {Object.<string, string>} */
    const overloads = {}
    Object.entries(params).forEach(([param, value]) => {
        const RE = new RegExp(`\\[${param}\\]|\\:${param}`)
        if (path.match(RE)) path = path.replace(`[${param}]`, encodeURI(value))
        else overloads[param] = value
    })
    const query = route.router.queryHandler.stringify(overloads, route)

    return path + query
}

export const urlFromAddress = () =>
    (({ pathname, search, hash }) => pathname + search + hash)(window.location)

let _globalAutoIncrementerCount = {}
export const autoIncrementer = (
    storeObj = _globalAutoIncrementerCount,
    name = '__NA',
) => {
    storeObj[name] = storeObj[name] || 0
    storeObj[name]++
    return storeObj[name]
}

/**
 * @template  T
 * @param {string} prop
 * @returns {function(T, number, T[]): boolean}
 */
export const distinctBy = prop => (obj, i, arr) =>
    arr.findIndex(_obj => _obj[prop] === obj[prop]) === i

export const contexts = {
    /** @type {Router} */
    get router() {
        return getContext('routify-fragment-context').route.router
    },
    /** @type {FragmentContext} */
    get fragment() {
        return getContext('routify-fragment-context')
    },
}

/**
 * gets context if available without throwing errors outside component initialization
 * @param {string} name
 * @returns
 */
export const getContextMaybe = name => {
    try {
        return getContext(name)
    } catch (err) {}
}

/**
 * @template T
 * @typedef {import('svelte/store').Writable<T> & {get: ()=>T}} Getable
 */

/**
 * like writable, but with an added get prop
 * @template T
 * @param  {T} value
 * @param  {import('svelte/store').StartStopNotifier<T>=} start
 * @returns {Getable<T>}
 */
export const getable = (value, start) => {
    const store = writable(value, start)
    return Object.assign(store, { get: () => get(store) })
}

/**
 * checks if all route.fragments and url are identical
 * @param  {...Route} routes
 * @returns
 */
export const identicalRoutes = (...routes) =>
    routes
        .map(route => JSON.stringify([route?.allFragments, route?.url]))
        .reduce((prev, curr) => prev === curr && curr)

/**
 * Shallow clones class instance.
 * Variadic parameters are assigned to clone.
 * @template T
 * @param {T} obj
 * @param  {...any} rest
 * @returns {T}
 */
export const clone = (obj, ...rest) =>
    Object.assign(Object.create(Object.getPrototypeOf(obj)), obj, ...rest)
