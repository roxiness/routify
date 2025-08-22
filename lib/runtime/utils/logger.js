import { createLogger } from 'consolite'
const log = createLogger('[rf3]')
log.register('verbose', console.log)
log.levels.verbose = 5

export const createRootLogger = () => {
    Object.assign(log, loadState())
    return new Proxy(log, {
        get: (target, prop) => target[prop.toString()],
        set: (target, prop, value) => {
            target[prop.toString()] = value
            saveState(log)
            return true
        },
    })
}

export const loadState = () => {
    if (typeof window === 'undefined') {
        const level = process.env.DEBUG_LEVEL
        const filter = process.env.DEBUG_FILTER
        return { level, filter }
    } else {
        return JSON.parse(localStorage.getItem('__routify.logState') || '{}')
    }
}

export const saveState = log => {
    const { level, filter } = log
    if (typeof window === 'undefined') {
        process.env.DEBUG_LEVEL = level
        process.env.DEBUG_FILTER = filter
    } else localStorage.setItem('__routify.logState', JSON.stringify({ filter, level }))
}

/**
 * @template {function} T
 * @param {T} fn
 * @param {string} msg
 * @returns {T}
 */
export const debugWrapper =
    (fn, msg) =>
    /** @ts-ignore */
    (...params) => {
        const result = fn(...params)
        log.debug(msg, { params, result })
        return result
    }
