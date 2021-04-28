import fse from 'fs-extra'
import { pathToFileURL, fileURLToPath } from 'url'
import { dirname } from 'path'

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
    hook.callCallbacks = attr => hook.callbacks.forEach(cb => cb(attr))

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
