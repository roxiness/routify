export const spreadsLast = node => (node.name.match(/\[\.\.\.(.+)\]/) ? 1 : -1)

/**
 *
 * @param {RouteFragment[]} routeFragments
 * @returns {RNodeRuntime}
 */
export const getNearestAncestorNodeWithSpreadParam = routeFragments => {
    for (const fragment of [...routeFragments].reverse()) {
        for (const node of fragment.node.parent?.children || []) {
            const match = node.name.match(/\[\.\.\.(.+)\]/)
            if (match) return node
        }
    }
}

export const getUrlFragments = url =>
    url
        .replace(/[?#].+/, '') // strip the search and hash query
        .replace(/\/$/, '') // strip trailing slash
        .split('/')
        .slice(1) // skip the first fragment since it will always be empty

export const indexOfNode = (fragments, node) =>
    fragments.findIndex(fragment => fragment.node === node)

/**
 * @template {string|string[]} T
 * @param {T} strOrArr
 * @returns {T}
 */
const uriDecodeStringOrArray = strOrArr =>
    strOrArr instanceof Array
        ? /** @type {T} */ (strOrArr.map(decodeURI))
        : /** @type {T} */ (decodeURI(strOrArr))

export const URIDecodeObject = obj =>
    Object.entries(obj).reduce(
        (_return, [key, value]) => ({
            ..._return,
            [key]: uriDecodeStringOrArray(value),
        }),
        {},
    )
