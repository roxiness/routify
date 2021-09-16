import { createLogger } from 'consolite'
const log = createLogger('[rf3]')

export { log }

export const getLogLevel = () =>
    (typeof window === 'undefined'
        ? process.env.DEBUG_LEVEL
        : localStorage.getItem('__routify.debugLevel')) ?? 0
export const setLogLevel = value => {
    typeof window === 'undefined'
        ? (process.env.DEBUG_LEVEL = value)
        : localStorage.setItem('__routify.debugLevel', value)
    log.level = value
}

log.level = Number(getLogLevel())

/**
 * @template {function} T
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
