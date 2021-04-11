import cheerio from "cheerio"
import { existsSync, mkdirSync, writeFileSync, writeSync } from "fs"
import { readFile } from "fs/promises"
import { fileURLToPath, pathToFileURL } from 'url'
import { dirname, relative } from "path";
import { Routify } from "../../../lib/Routify.js";

/**
 * return meta data from comments
 * @param {string} body 
 */
export const parseComment = body => {
    body = body.trim()

    const matches = body.match(/^routify:meta +([^=]+) *= *(.+)/)
    if (matches)
        return { [matches[1]]: JSON.parse(matches[2]) }
}

/**
 * 
 * @param {string} filepath file to check for inlined html meta comments
 * @returns {any}
 */
export const htmlComments = async filepath => {    
    const meta = {}
    // todo can we get rid of this div? It won't parse files with only comments in them
    const content = '<div />' + await readFile(filepath, 'utf-8')    
    const $ = cheerio.load(content)

    const comments = $('*').contents().filter((i, el) => el.type === 'comment')
    comments.each((i, c) => Object.assign(meta, parseComment(c.data)))    
    return meta
}

/**
 * 
 * @param {string} key name of the meta entry: <key>.$split
 * @param {any} value JSON.stringifiable value
 * @param {string} output destination for code split files
 */
const writeCodesplitMeta = (key, value, output) => {
    const content = JSON.stringify(value, null, 2)
    const metaFilePath = `${output}/_meta_${key}.js`
    mkdirSync(output, { recursive: true })
    writeFileSync(metaFilePath, `export default ${content}`)
    return () => import(pathToFileURL(metaFilePath).href).then(r => r.default)
}

/**
 * reads meta from <filename>.meta.js files
 * props ending in $split, eg. largePost.$split will be converted to getters 
 * and the value will be imported as a dynamic import
 * @param {string} filepath file to check for sibling meta file
 * @param {string} output destination for code split files
 */
export const externalComments = async (filepath, output) => {
    const metaFilePath = filepath.replace(/(.+)\.[^.]+$/, '$1.meta.js')
    if (existsSync(metaFilePath)) {
        const meta = await import(pathToFileURL(metaFilePath).pathname).then(r => r.default())

        // replace <name>.$split props with <name> getters
        Object.entries(meta).forEach(([oldKey, value]) => {
            const matches = oldKey.match(/^(.+)\.\$split/)
            if (matches) {
                // create a getter
                const [, key] = matches
                const splitValue = writeCodesplitMeta(key, value, output)
                Object.defineProperty(meta, key, {
                    get: splitValue,
                    enumerable: true
                })
                // delete the <name>.$split key
                delete meta[oldKey]
            }
        })
        return meta
    }
}

/**
 * @param {{instance: Routify}}
 */
export default async ({ instance }) => {
    const promises = instance.nodeIndex.map(async node => {
        if (node.file && !node.file.stat.isDirectory()) {
            const metaPromises = [
                externalComments(node.file.path, instance.options.routifyDir),
                htmlComments(node.file.path)
            ]
            Object.assign(node.meta, ...await Promise.all(metaPromises))
        }
    })
    await Promise.all(promises)
}