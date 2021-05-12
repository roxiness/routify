/**
 * @typedef {{name: string, url?: string}} Router
 */

/**
 * @typedef {Object} BrowserAdapterOptions
 * @prop {string} delimiter separates the url of each router
 * @prop {(router: Router)=>string} format defaults to `${router.name}=${router.url}`
 */

/** @type {BrowserAdapterOptions} */
const defaults = {
    delimiter: ';',
    format: router =>
        router.name ? `${router.name}=${router.url}` : router.url,
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
        toRouter: (url, { name }) => {
            const formatRE = format({ name, url: '(.+?)' })
            const RE = new RegExp(`(^|${delimiter})${formatRE}(${delimiter}|$)`)

            const matches = url.match(RE)
            return matches ? matches[2] : url
        },

        /**
         * @param {Router[]} routers
         * @returns {string}
         */
        toBrowser: routers => routers.map(format).join(delimiter),
    }
}
