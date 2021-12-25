const RE = /\[(.+?)\]/gm

const createUrlParamUtils = () => {
    /**
     * returns ["slug", "id"] from "my[slug]and[id]"
     * @param {string} name
     * @returns {string[]}
     */
    const getFieldsFromName = name => [...name.matchAll(RE)].map(v => v[1])

    /**
     * converts "my[slug]and[id]" to /my(.+)and(.+)/gm
     * @param {string} name
     * @returns {RegExp}
     */
    const getRegexFromName = name => new RegExp(name.replace(RE, '(.+)'))

    /**
     * returns an array of values matching a regular expresion and path
     * @param {RegExp} re
     * @param {string} path
     * @returns {string[]}
     */
    const getValuesFromPath = (re, path) => (path.match(re) || []).slice(1)

    /**
     * converts (['a', 'b', 'c'], [1, 2, 3]) to {a: 1, b: 2, c: 3}
     * @param {string[]} fields
     * @param {string[]} values
     * @returns
     */
    const mapFieldsWithValues = (fields, values) =>
        haveEqualLength(fields, values) &&
        fields.reduce((map, field, index) => {
            map[field] = values[index]
            return map
        }, {})

    const haveEqualLength = (fields, values) => {
        if (fields.length !== values.length)
            throw new Error(
                'fields and values should be of same length' +
                    `\nfields: ${JSON.stringify(fields)}` +
                    `\nvalues: ${JSON.stringify(values)}`,
            )
        return true
    }

    return {
        getFieldsFromName,
        getRegexFromName,
        getValuesFromPath,
        mapFieldsWithValues,
        haveEqualLength,
    }
}

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

export const URIDecodeObject = obj =>
    Object.entries(obj).reduce(
        (_return, [key, value]) => ({
            ..._return,
            [key]: decodeURI(value),
        }),
        {},
    )
