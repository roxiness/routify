/**
 * @typedef {Object} BrowserAdapterOptions
 * @prop {string} delimiter separates the url of each router
 * @prop {(router: Router)=>string} format defaults to `${router.name}=${router.url}`
 */

import { distinctBy } from '../utils/index.js'

/** @type {BrowserAdapterOptions} */
const defaults = {
    delimiter: ';',
    format: ({ name, url }) => (name ? `${name}=${url}` : url),
}

/** @param {BrowserAdapterOptions} input */
export const BrowserAdapter = (input = defaults) => {
    const { delimiter, format } = { ...defaults, ...input }

    return {
        /**
         * @param {string} url
         * @param {Router} router
         * @returns {string}
         */
        toRouter: (url, router) => {
            const formatRE = format({ ...router, url: '(.+?)' })
            const RE = new RegExp(`(^|${delimiter})${formatRE}(${delimiter}|$)`)

            const matches = url.match(RE)
            return matches ? matches[2] : '/'
        },

        /**
         * @param {Router[]} routers
         * @returns {string}
         */
        toBrowser: routers =>
            routers.filter(distinctBy('name')).map(format).join(delimiter),
    }
}
