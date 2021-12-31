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
    const paths = [
        resolve(process.cwd(), rawPath),
        resolve(process.cwd(), rawPath + '.js'),
        resolve(process.cwd(), rawPath + '.cjs'),
        resolve(process.cwd(), rawPath + '.mjs'),
        resolve(process.cwd(), rawPath, 'index.js'),
        resolve(process.cwd(), rawPath, 'index.mjs'),
        resolve(process.cwd(), rawPath, 'index.cjs'),
    ].map(path => `file://${path.replace(/\\/g, '/')}`)

    for (const path of [rawPath, ...paths]) {
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
        `couldn't find plugin: ${rawPath}. Checked paths:\n${[rawPath, ...paths].join(
            '\n',
        )}`,
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

export const throttle = (() => {
    const map = new Map()

    const throttle = async fn => {
        const fnStr = fn.toString()
        map.set(fnStr, map.get(fnStr) || { isRunning: false, runAgain: false })
        const s = map.get(fnStr)

        if (s.isRunning) s.runAgain = true
        else {
            s.isRunning = true
            await fn()
            s.isRunning = false
            if (s.runAgain) {
                s.runAgain = false
                await throttle(fn)
            }
        }
    }
    return throttle
})()

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
