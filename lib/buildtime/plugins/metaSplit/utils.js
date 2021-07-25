import { mkdirSync } from 'fs'
import { writeFileIfDifferentSync } from '#lib/buildtime/utils.js'
import { dirname } from 'path'

/**
 * @param {any} value
 * @param {string} path
 */

const split = (value, path) => {
    value = value instanceof Function ? value.toString() : JSON.stringify(value)
    mkdirSync(dirname(path), { recursive: true })
    writeFileIfDifferentSync(path, `export default ${value}`)
}

export { split }
