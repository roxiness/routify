import '#root/typedef.js'
import { derived, readable, writable } from 'svelte/store'
import { pathAndParamsToUrl, context } from './utils.js'

/**
 * @typedef {Object} IsActiveOptions
 * @prop {Boolean} [recursive=true] return true if descendant is active
 */

/**
 * @callback IsActive
 * @param {String=} path
 * @param {Object.<string,string>} [params]
 * @param {IsActiveOptions} [options]
 * @returns {Boolean}
 */

/** @type {import('svelte/store').Readable<IsActive>} */
export const isActive = {
    subscribe: (run, invalidate) =>
        derived(context.router.activeUrl, _isActive).subscribe(run, invalidate),
}

export const _isActive = $url => isActiveUrl($url.url)

export const isActiveUrl =
    url =>
    /** @type {IsActive} */
    (path, params, options = {}) => {
        const { recursive } = { recursive: true, ...options }
        path = pathAndParamsToUrl(path, params, x => '')
        if (recursive) path = path.replace(/\/index\/?$/, '')

        // ensure uniform string endings to prevent /foo matching /foobar
        return (url + '/').startsWith(path + '/')
    }
