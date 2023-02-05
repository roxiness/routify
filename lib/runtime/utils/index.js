import { get, writable } from 'svelte/store'
import { getContext } from 'svelte'
import { RouteFragment } from '../Route/RouteFragment.js'
import { appInstance } from '../Global/Global.js'
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
 * Creates an url from a path and params objects
 * @example no wildcard
 * ```javascript
 * pathAndParamsToUrl('/foo/[slug]/[id]', {slug: 'hello'})
 * // /foo/hello/[id]
 * ```
 * @example wildcard
 * ```javascript
 * pathAndParamsToUrl('/foo/[slug]/[id]', {slug: 'hello'}, undefined, true)
 * // /foo/hello/.*?
 * ```
 * @param {string} path
 * @param {Object.<string|number,string|number>} params
 * @param {function} queryHandler
 * @param {boolean} useWildcards inserts wildcards for unmatched params
 * @returns {string}
 */
export const pathAndParamsToUrl = (path, params = {}, queryHandler, useWildcards) => {
    Object.entries(params).forEach(([key, val]) => {
        if (path.includes(`[${key}]`)) {
            path = path.replace(`[${key}]`, val)
            delete params[key]
        }
    })

    if (useWildcards) path = insertWildcards(path)

    return path + queryHandler(params)
}

/**
 * replaces /path/[foo]/bar with /path/.*?/bar
 * @param {string} str
 */
export const insertWildcards = str => {
    return str.replace(/\[.*?\]/, '.*?')
}

export const fromEntries = iterable => {
    return [...iterable].reduce((obj, [key, val]) => {
        obj[key] = val
        return obj
    }, {})
}

/**
 * replaces [] brackets in a string with actual params
 * @param {string} path
 * @param {Object.<string,(string|string[])>} params
 * @param {Route} route
 * @returns
 */
export const populateUrl = (path, params, route) => {
    /** @type {Object.<string, string>} */
    const overloads = {}
    Object.entries(params).forEach(([param, value]) => {
        const RE = new RegExp(`\\[(\.\.\.)?${param}\\]|\\:${param}`)
        value = Array.isArray(value) ? value.join('/') : value
        if (path.match(RE)) path = path.replace(RE, encodeURI(value))
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

/** @returns {RenderContext} */
const getGlobalContext = () => {
    console.log('Using helpers outside router context is not supported. Use at own risk.')
    const router = appInstance.routers[0]
    const route = router.activeRoute.get() || router.pendingRoute.get()

    return {
        elem: null,
        anchorLocation: null,
        options: null,
        childFragments: writable(route.allFragments),
        node: router.rootNode,
        fragment: route.allFragments[0],
        isActive: writable(false),
        isVisible: writable(false),
        multi: null,
        router,
        route,
        parentContext: null,
        onDestroy: null,
        decorators: [],
        single: writable(true),
        scrollBoundary: null,
    }
}

export const contexts = {
    /** @type {Router} */
    get router() {
        return (getContext('routify-fragment-context') || getGlobalContext()).router
    },
    /** @type {RenderContext} */
    get fragment() {
        return getContext('routify-fragment-context') || getGlobalContext()
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

export const isAnonFn = input => typeof input === 'function' && !input.prototype

/**
 * @template T
 * @param {T} input
 * @returns {T extends (...args: any[]) => any ? T : (...args: any[]) => T}
 */
export const resolveIfAnonFn =
    input =>
    // @ts-ignore
    (...payload) =>
        // @ts-ignore
        isAnonFn(input) ? input(...payload) : input

/**
 * Takes an array to clone and an A) item to push to the array or B an anonymous function where the first parameter is the cloned array
 * @example
 * ```javascript
 * const array = [1,2,3] *
 * pushToOrReplace(array, 'foo')                    // [1, 2, 3, 'foo']
 * pushToOrReplace(array, ()=>['foo'])              // ['foo']
 * pushToOrReplace(array, (arr)=>['foo', ...arr])   // ['foo', 1, 2, 3]
 * ```
 * @param {any[]} arr
 * @param {any} input anonymous functions will be treated as callbacks
 * @returns
 */
export const pushToOrReplace = (arr, input) => {
    const _isAnonFn = isAnonFn(input)
    input = _isAnonFn || Array.isArray(input) ? input : [input]

    const res = _isAnonFn ? input([...arr]) : [...arr, ...input]
    if (!Array.isArray(res)) throw new Error('anonymous callback did not return array')
    return res
}

/**
 * @template T
 * @param {import('svelte/store').Writable<T>} store
 * @param {(T)=>boolean} cb
 * @returns {Promise<T>}
 */
export const waitFor = (store, cb) =>
    new Promise((resolve, reject) => {
        try {
            const unsub = store.subscribe(val => {
                if (cb(val)) {
                    resolve(val)
                    setTimeout(() => unsub)
                }
            })
        } catch (err) {
            reject(err)
        }
    })
