import fse from 'fs-extra'
import { pathToFileURL } from 'url'

/**
 * saves value to file and returns a dynamic-import function that returns the value
 * @param {string} file file to save data to
 * @param {any} value JSON.stringifiable value
 */
 export const writeDynamicImport = (file, value) => {
    const content = JSON.stringify(value, null, 2)
    fse.outputFileSync(file, `export default ${content}`)
    return () => import(pathToFileURL(file).href).then((r) => r.default)
}

