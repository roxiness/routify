import fse from 'fs-extra'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

/**
 * saves value to file and returns a dynamic-import function that returns the value
 * @param {string} outputDir dynamic import will be relative to this path
 * @param {string} file file to save data to
 * @param {any} value JSON.stringifiable value
 */
export const writeDynamicImport = (outputDir, file, value) => {
    fse.outputFileSync(`${outputDir}/${file}`, `export default ${value}`)
    return `() => import('./${file}').then(r => r.default)::_EVAL`
}

export const createDirname = meta => dirname(fileURLToPath(meta.url))

export function hookHandler() {
    let callbacks = []
    const hook = cb => {
        callbacks.push(cb)
        return () => {
            const index = callbacks.indexOf(cb)
            callbacks.splice(index, 1)
        }
    }
    hook.callbacks = callbacks
    hook.runHooks = attr => hook.callbacks.forEach(cb => cb(attr))

    return hook
}

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

export const sanitizeConfig = config => {
    if (typeof config.routesDir === 'string')
        config.routesDir = { default: config.routesDir }
    return config
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
            return await import(path).then(r => r.default(options))
        } catch (err) {}
    }
    throw new Error(
        `couldn't find plugin: ${rawPath}. Checked paths:\n${[rawPath, ...paths].join(
            '\n',
        )}`,
    )
}

export const resolvePlugins = async plugins => {
    const promises = plugins
        .map(plugin => (typeof plugin === 'string' ? { path: plugin } : plugin))
        .map(async plugin => (plugin.path ? await resolvePlugin(plugin) : plugin))
    return await Promise.all(promises)
}
