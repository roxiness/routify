import { mkdirSync } from 'fs'
import { writeFileIfDifferentSync } from '#lib/buildtime/utils.js'
import { dirname, relative } from 'path'

/**
 * creates import function that returns a stringified function for JSON
 * @param {string} path
 * @param {string} importFrom
 * @returns {()=>Promise<any>}
 */
const createResolver = (path, importFrom) => {
    const relativePath = relative(importFrom, path).replace(/\\/g, '/')

    const resolver = () => import(path).then(r => r.default)

    resolver.toJSON = () =>
        `() => import('./${relativePath}').then(r => r.default)::_EVAL`
    return resolver
}

/**
 * curried func
 * @param {string} importFrom
 */
export const split =
    (importFrom = '.routify') =>
    /**
     * @param {any} value
     * @param {string} path
     */
    (value, path) => {
        value = value instanceof Function ? value.toString() : JSON.stringify(value)
        mkdirSync(dirname(path), { recursive: true })
        writeFileIfDifferentSync(path, `export default ${value}`)

        return createResolver(path, importFrom)
    }

const stringHashCode = str =>
    str
        .split('')
        .reduce((a, b) => {
            a = (a << 5) - a + b.charCodeAt(0)
            return a & a
        }, 0)
        .toString(36)

export const hashObj = val => {
    let str = JSON.stringify(val)
    str = str || (val.toJSON ? val.toJSON() : val.toString())
    const length = str.length
    const snippet = str
        .replace(/[^\w]/gm, '_')
        .replace(/\_+/gm, '_')
        .replace(/^\_/, '')
        .slice(0, 20)
    return snippet + '-' + length + '-' + stringHashCode(str)
}
