import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { dirname, resolve } from 'path'

/**
 * @param {any} value
 * @param {string} path
 */

const split = (value, path) => {
    value = value instanceof Function ? value.toString() : JSON.stringify(value)
    mkdirSync(dirname(path), { recursive: true })
    writeFileSync(path, `export default ${value}`)
}

/**
 * @param {function} fn
 * @param {string} path
 * @param {boolean=} refresh
 */
const cached = async (fn, path, refresh) => {
    if (!existsSync(path) || refresh) {
        let value = await fn()
        value =
            value instanceof Function ? value.toString() : JSON.stringify(value)
        writeFileSync(path, `export default ${value}`)
        return eval(value)
    }
    return import('file:///' + resolve(path)).then(r => r.default)
}

export { split, cached }
