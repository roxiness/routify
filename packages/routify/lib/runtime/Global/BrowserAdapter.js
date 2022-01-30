/** @returns {BrowserAdapter} */
export const createBrowserAdapter = opts => {
    const delimiter = opts?.delimiter || ';'

    return {
        // Called by each router when the browser URL changes. Returns an internal URL for each respective router.
        toRouter: (url, router) => {
            const formatRE = router.name ? `${router.name}=(.+?)` : `(.+?)`
            const RE = new RegExp(`(^|${delimiter})${formatRE}(${delimiter}|$)`)

            const matches = url.match(RE)
            return matches ? matches[2] : '/'
        },
        // compiles all router URLS into a single URL for the browser.
        toBrowser: routers =>
            routers
                .map(r => (r.name ? `${r.name}=` : '') + r.url.external())
                .join(delimiter),
    }
}
