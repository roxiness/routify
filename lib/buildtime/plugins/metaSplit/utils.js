import { mkdirSync } from 'fs'
import fse from 'fs-extra'
import { dirname } from 'path'

/**
 * @param {any} value
 * @param {string} path
 */

const split = (value, path) => {
    value = value instanceof Function ? value.toString() : JSON.stringify(value)
    mkdirSync(dirname(path), { recursive: true })
    fse.outputFileSync(path, `export default ${value}`)
}

export { split }
