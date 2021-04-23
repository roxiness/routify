import '../typedef.js'
import { getContext } from 'svelte'
import { derived, readable, writable } from 'svelte/store'

/**
 * @returns {RoutifyRuntime}
 */
const getInstance = () => getContext('routify-instance')

/**
 * @typedef {Object.<String,String>} UrlParams
 * @typedef {Object.<String,String>} UrlOptions
 */

/**
 * @callback IsActiveHelper
 * @param {String=} path
 * @param {UrlParams=} params
 * @param {UrlOptions=} options
 * @returns {Boolean}
 */

/** @type {import('svelte/store').Readable<IsActiveHelper>} */
export const isActive = readable(
    (...params) => false,
    set =>
        getInstance().urlHandler.subscribe($url =>
            set((path, params, options) => $url.startsWith(path)),
        ),
)
