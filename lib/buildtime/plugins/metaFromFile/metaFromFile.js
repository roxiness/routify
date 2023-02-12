import cheerio from 'cheerio'
import fse from 'fs-extra'
import { relative } from 'path'
import { createDirname } from '../../../buildtime/utils.js'
import createCacheWrap from 'cachewrap'
import { printReservedWarnings } from './utils.js'

const cacheWrap = createCacheWrap()

const { readFile, existsSync } = fse
const __dirname = createDirname(import.meta)
const metaToFileHistory = []

/**
 * @param {{instance: RoutifyBuildtime}} param0
 */
export const metaFromFile = async ({ instance }) => {
    const getExternalMetaWithCache = cacheWrap(getExternalMeta)
    const { routifyDir } = instance.options

    const promises = instance.nodeIndex.map(async node => {
        if (node.file && !node.file.stat.isDirectory()) {
            let context = {
                instance,
                node,
                options: instance.options,
                tempPath: routifyDir + '/cached/' + node.file.path,
            }
            for (const plugin of instance.plugins) {
                if (plugin.metaContext) context = await plugin.metaContext(context)
            }

            // todo provide split and persistable helper + tests

            const metaPromises = [
                getExternalMetaWithCache(node.file.path, context),
                htmlComments(node.file.path),
            ]
            const meta = Object.assign({}, ...(await Promise.all(metaPromises)))

            metaToFileHistory.push({ node, meta })

            Object.assign(node.meta, meta)
        }
    })
    await Promise.all(promises)
    printReservedWarnings(metaToFileHistory, instance.options.ignoreMetaConflictWarnings)
}

/**
 * return meta data from comments
 * @param {string} body
 */
export const parseComment = body => {
    body = body.trim()

    const matches = body.match(/^routify:meta +([^=]+) *= *(.+)/)
    if (matches) return { [matches[1]]: JSON.parse(matches[2]) }

    const flagMatch = body.match(/^routify:meta ([^ ]+)/)
    if (flagMatch) return { [flagMatch[1]]: true }
}

/**
 * @param {string} filepath file to check for inlined html meta comments
 */
export const htmlComments = async filepath => {
    /** @type {Object.<string, any>} */
    const meta = {}
    // todo can we get rid of this div? It won't parse files with only comments in them
    const content = '<div />' + (await readFile(filepath, 'utf-8'))
    const $ = cheerio.load(content)

    const comments = $('*')
        .contents()
        .filter((i, el) => el.type === 'comment')
    // @ts-ignore
    comments.each((i, c) => Object.assign(meta, parseComment(c.data)))
    return meta
}

/**
 * reads meta from <filename>.meta.js files
 * @param {string} filepath file to check for sibling meta file
 */
export const getExternalMeta = (filepath, context) => {
    const metaFilePath = filepath.replace(/(.+)\.[^.]+$/, '$1.meta.js')

    if (existsSync(metaFilePath)) {
        const path = './' + relative(__dirname, metaFilePath)
        return import(path).then(r => {
            try {
                return r.default(context)
            } catch (err) {
                console.error(err)
                throw new Error(`could't read meta from ${path}`)
            }
        })
    }
}
