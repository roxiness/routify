const defaultRe = /\[(.+?)\]/gm // matches [string]
export class UrlParamUtils {
    constructor(RE = defaultRe) {
        this.RE = RE
    }

    /**
     * returns ["slug", "id"] from "my[slug]and[id]"
     * @param {string} name
     * @returns {string[]}
     */
    getFieldsFromName = name => [...name.matchAll(this.RE)].map(v => v[1])

    /**
     * converts "my[slug]and[id]" to /my(.+)and(.+)/gm
     * @param {string} name
     * @returns {RegExp}
     */
    getRegexFromName = name => new RegExp('^' + name.replace(this.RE, '(.+)') + '$')

    /**
     * returns an array of values matching a regular expresion and path
     * @param {RegExp} re
     * @param {string} path
     * @returns {string[]}
     */
    getValuesFromPath = (re, path) => (path.match(re) || []).slice(1)

    /**
     * converts (['a', 'b', 'c'], [1, 2, 3]) to {a: 1, b: 2, c: 3}
     * @param {string[]} fields
     * @param {string[]} values
     * @returns
     */
    mapFieldsWithValues = (fields, values) =>
        this.haveEqualLength(fields, values) &&
        fields.reduce((map, field, index) => {
            map[field] = values[index]
            return map
        }, {})

    haveEqualLength = (fields, values) => {
        if (fields.length !== values.length)
            throw new Error(
                'fields and values should be of same length' +
                    `\nfields: ${JSON.stringify(fields)}` +
                    `\nvalues: ${JSON.stringify(values)}`,
            )
        return true
    }

    // todo unused?
    // generateParamsFromFragment(fragment) {
    //     return this.mapFieldsWithValues(
    //         this.getFieldsFromName(fragment.node.name),
    //         this.getValuesFromPath(fragment.node.regex, fragment.urlFragment),
    //     )
    // }
}
