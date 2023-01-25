import fse from 'fs-extra'
import { fileURLToPath } from 'url'
import { dirname, resolve, relative } from 'path'
import { mkdirSync, existsSync, readFileSync } from 'fs'

export const relativeUnix = (path, path2) => relative(path, path2).replace(/\\/g, '/')

export const createDirname = meta => dirname(fileURLToPath(meta.url))

/**
 * JSON.stringify wrapper that leaves values ending in ::_EVAL unquoted
 * @param {any} obj
 * @returns {string}
 */
export const stringifyWithEscape = obj => {
    const str = JSON.stringify(obj, null, 2)
    return str.replace(
        /^( *)"(.+?)": "(.+)::_EVAL"(,?)$/gm,
        (_, spaces, key, value, comma) =>
            `${spaces}"${key}": ${JSON.parse(`"${value}"`)}${comma}`,
    )
}

const resolvePlugin = async plugin => {
    const { path: rawPath, options } = plugin
    const extensions = [
        '',
        '.js',
        '.cjs',
        '.mjs',
        '.ts',
        '/index.js',
        '/index.cjs',
        '/index.mjs',
        '/index.ts',
    ]

    const packagePaths = extensions.map(ext => rawPath + ext)
    const localPaths = extensions.map(
        ext => `file://${resolve(rawPath + ext).replace(/\\/g, '/')}`,
    )

    const allPaths = [...packagePaths, ...localPaths]

    for (const path of [...packagePaths, ...localPaths]) {
        try {
            // If module.exports is used or export defualt
            return await import(path).then(r =>
                typeof r == 'function' ? r(options) : r.default(options),
            )
        } catch (err) {
            if (err.code != 'ERR_MODULE_NOT_FOUND') {
                console.error(`couldn't load plugin "${path}"`)
                throw err
            }
        }
    }
    throw new Error(
        `couldn't find plugin: ${rawPath}. Checked paths:\n${allPaths.join('\n')}`,
    )
}

/**
 * todo update plugins
 * @param {any[]} plugins
 * @returns {Promise<RoutifyBuildtimePlugin[]>}
 */
export const resolvePlugins = async plugins => {
    const promises = plugins
        .map(plugin => (typeof plugin === 'string' ? { path: plugin } : plugin))
        .map(async plugin => (plugin.path ? await resolvePlugin(plugin) : plugin))
    return await Promise.all(promises)
}

export const writeFileIfDifferent = async (path, content) => {
    if (!existsSync(path) || readFileSync(path, 'utf-8') !== content)
        await fse.outputFile(path, content)
}

export const writeFileIfDifferentSync = (path, content) => {
    if (!existsSync(path) || readFileSync(path, 'utf-8') !== content)
        fse.outputFileSync(path, content)
}

/**
 * creates import function that returns a stringified function for JSON
 * @param {string} path
 * @param {string} importFrom
 * @returns {()=>Promise<any>}
 */
const createResolver = (path, importFrom) => {
    const relativePath = relativeUnix(importFrom, path)

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

/**
 * Recursively set properties on nested objects. Dynamically creates missing nested objects.
 * @example
 * deepSet(globalThis, 'document', 'body', 'className', 'app container')
 */
export const deepSet = (t, p, ...v) =>
    v.length > 1 ? (t[p] = t[p] || {}) && deepSet(t[p], ...v) : (t[p] = v[0])
