import { existsSync, mkdirSync } from 'fs'
import fse from 'fs-extra'
import { dirname, resolve } from 'path'

/**
 * @param {any} value
 * @param {string} path
 */

const split = (value, path) => {
    value = value instanceof Function ? value.toString() : JSON.stringify(value)
    mkdirSync(dirname(path), { recursive: true })
    fse.outputFileSync(path, `export default ${value}`)
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
        fse.outputFileSync(path, `export default ${value}`)
        return eval(value)
    }
    return import('file:///' + resolve(path)).then(r => r.default)
}

export { split, cached }
