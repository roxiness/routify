import { existsSync } from 'fs'
import { writeFileIfDifferentSync } from '../../../buildtime/utils.js'
import { resolve } from 'path'

// todo should be used

/**
 * caches result of a function and returns cached value on subsequent calls
 * @param {function} fn
 * @param {string} path
 * @param {boolean=} refresh
 */
const cached = async (fn, path, refresh) => {
    if (!existsSync(path) || refresh) {
        let value = await fn()
        value = value instanceof Function ? value.toString() : JSON.stringify(value)
        writeFileIfDifferentSync(path, `export default ${value}`)
        return eval(value)
    }
    return import('file:///' + resolve(path)).then(r => r.default)
}
