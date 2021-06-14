import { writable } from 'svelte/store'
import '#root/typedef.js'
import pino from 'pino/browser'
import { getContext } from 'svelte'

export const getLogLevel = () =>
    typeof window === 'undefined'
        ? process.env.DEBUG_LEVEL
        : window.__routify?.debugLevel ||
          localStorage.getItem('__routify.debugLevel')

export const log = pino({
    level: getLogLevel(),
})

export const setLogLevel = value => {
    typeof window === 'undefined'
        ? (process.env.DEBUG_LEVEL = value)
        : localStorage.setItem('__routify.debugLevel', value)
    log.level = value
}

/**
 * @template T
 * @param {T} fn
 * @param {string} msg
 * @returns {T}
 */
export const debugWrapper =
    (fn, msg) =>
    (...params) => {
        const result = fn(...params)
        log.debug(msg, { params, result })
        return result
    }

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
 * creates a hook collection
 * @example
 * const hooksCollection = createHook()
 * const unhookFn = hooksCollection(x => console.log('hello', x))
 * const unhookFn2 = hooksCollection(x => console.log('goodbye', x))
 *
 * // call hooks
 * hooksCollection.hooks.forEach(hook => hook('Jake'))
 * // logs "hello Jake" and "goodbye Jake"
 *
 * // unregister
 * unhookFn()
 * unhookFn2()
 */
export const createHook = () => {
    const hooks = []

    /**
     * @param {Function} hook
     * @returns {Function} unhook
     */
    const addHook = hook => {
        hooks.push(hook)
        const index = hooks.indexOf(hook)
        const unhook = () => hooks.splice(index, 1)
        return unhook
    }
    addHook.hooks = hooks

    return addHook
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
 * @template T
 * @param {string} prop
 * @returns {(T, number, T[]) => T[]}
 */
export const distinctBy = prop => (obj, i, arr) =>
    arr.findIndex(_obj => _obj[prop] === obj[prop]) === i

/**
 * @typedef {Object} Context
 * @prop {Router} router
 * @prop {any} component
 */

/** @type {Context} */
export const context = {}

Object.defineProperties(context, {
    /** @returns {RoutifyRuntime} */
    router: { get: () => getContext('routify-component').route.router },
    component: { get: () => getContext('routify-component') },
})