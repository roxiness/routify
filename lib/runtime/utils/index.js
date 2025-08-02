import { get, writable } from 'svelte/store'
import { getContext, setContext } from 'svelte'
import { appInstance } from '../Global/Global.js'
export * from './logger.js' // ROUTIFY-DEV-ONLY

const CTX = 'routify-fragment-context'

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

export const getRoutifyFragmentContext = suppress => {
    try {
        return getContext(CTX)
    } catch (e) {
        if (
            e.message.includes('lifecycle_outside_component') ||
            e.message.includes('Function called outside component initialization')
        ) {
            if (globalThis._routify_suppress_life_cycle_warning || suppress) return
            console.error(
                'Routify: Unable to access context.\n' +
                    "If you're using Svelte 5, ensure $ helpers are accessed at the root level of your component.",
            )
        } else throw e
    }
}

/**
 * gets context if available without throwing errors outside component initialization
 * @returns
 */
export const getRoutifyFragmentContextMaybe = () => getRoutifyFragmentContext(true)

export const setRoutifyFragmentContext = value => setContext(CTX, value)

export const isDescendantElem = parent => elem => {
    while ((elem = elem.parentNode)) if (elem === parent) return true
    return false
}

export const shouldIgnoreClick = event =>
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    event.shiftKey ||
    event.button ||
    (event.key && event.key !== 'Enter') ||
    event.defaultPrevented

const parseValue = value => {
    try {
        return JSON.parse(value)
    } catch (error) {
        return value
    }
}
const extractRoutifyStateData = el => {
    const routifyRouteState = {}

    for (let key in el.dataset) {
        if (key.startsWith('routifyRouteState')) {
            // remove 'routifyRouteState' from the key and convert first character to lowercase
            const shortKey = key.replace('routifyRouteState', '')
            const finalKey = shortKey.charAt(0).toLowerCase() + shortKey.slice(1)

            routifyRouteState[finalKey] = parseValue(el.dataset[key])
        }
    }
    return routifyRouteState
}

export const getUrlFromEvent = event => {
    const el = event.target.closest('a')
    const href = el && el.href

    if (!href || el.target || el.host !== location.host) return {}

    const urlObj = new URL(href)

    event.preventDefault()
    return {
        url: urlObj.pathname + urlObj.search + urlObj.hash,
        state: extractRoutifyStateData(el),
    }
}

// TODO REMOVE?
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
// export const pathAndParamsToUrl = (path, params = {}, queryHandler, useWildcards) => {
//     Object.entries(params).forEach(([key, val]) => {
//         if (path.includes(`[${key}]`)) {
//             path = path.replace(`[${key}]`, val)
//             delete params[key]
//         }
//     })

//     if (useWildcards) path = insertWildcards(path)

//     return path + queryHandler(params)
// }

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
 * @param {(obj: Object.<string, any>) => string} overloadStringifier
 * @returns
 */
export const populateUrl = (path, params, overloadStringifier) => {
    /** @type {Object.<string, string|string[]>} overloads are params that have no dedicated component */
    const overloads = {}
    Object.entries(params).forEach(([param, value], index) => {
        const RE = new RegExp(`\\[(\.\.\.)?${param}\\]|\\:${param}`)
        if (path.match(RE)) {
            const urlSegmentStr = Array.isArray(value) ? value.join('/') : value
            path = path.replace(RE, encodeURI(urlSegmentStr))
        } else overloads[param] = value
    })
    const query = overloadStringifier(overloads)

    return { path, query }
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
    if (!globalThis._routify_suppress_helper_warning)
        console.log(
            'Using helpers outside router context is not supported. Use at own risk.',
        )
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
        inline: null,
        router,
        route,
        parentContext: null,
        onDestroy: null,
        decorators: [],
        scrollLock: null,
        isInline: null,
        mounted: null,
    }
}

export const contexts = {
    /** @type {Router} */
    get router() {
        return (getRoutifyFragmentContext() || getGlobalContext()).router
    },
    /** @type {RenderContext} */
    get fragment() {
        return getRoutifyFragmentContext() || getGlobalContext()
    },
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
 * Resolves the given `subject` as a function if it is anonymous, otherwise returns the subject as is
 * @template T
 * @template P
 * @param {T | ((...P)=>T) | ((...P)=>Promise<T>) } subject The subject to be resolved.
 * @param {P[]=} params An optional array of parameters to pass to the anonymous function.
 * @returns {T}
 */
export const resolveIfAnonFn = (subject, params) =>
    isAnonFn(subject) ? /** @type {any} */ (subject)(...params) : subject

export const resolveIfHasCallback = (subject, params, field = 'callback') =>
    subject?.[field] ? subject[field](params) : subject

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
 * waits for the callback to return true
 * @template T
 * @param {import('svelte/store').Writable<T>} store the store to be passed to the callback
 * @param {(T)=>boolean} cb callback
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

/**
 * @template T
 * @returns {DeferredPromise<T>}
 */
export const createDeferredPromise = () => {
    let resolve, reject
    const promise = new Promise((_resolve, _reject) => {
        resolve = _resolve
        reject = _reject
    })

    return Object.assign(promise, { resolve, reject })
}

/**
 * ensures that the string starts with exactly one slash
 * @param {string} str
 * @returns {string}
 */
export const forceSingleSlash = str => '/' + str.replace(/^\/+/, '')
