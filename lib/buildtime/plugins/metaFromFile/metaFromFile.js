import cheerio from 'cheerio'
import fse from 'fs-extra'
import { relative } from 'path'
import { createDirname } from '#lib/buildtime/utils.js'
import { split } from './utils.js'

const { readFile, existsSync } = fse
const __dirname = createDirname(import.meta)

/**
 * @param {{instance: Routify}} param0
 */
export const metaFromFile = async ({ instance }) => {
    const promises = instance.nodeIndex.map(async node => {
        if (node.file && !node.file.stat.isDirectory()) {
            const relativePath = 'cached/' + node.file.path

            const context = {
                instance,
                options: instance.options,
                tempPath: instance.options.routifyDir + '/' + relativePath,
            }

            const metaPromises = [
                externalMeta(node.file.path, context),
                htmlComments(node.file.path),
            ]
            Object.assign(node.meta, ...(await Promise.all(metaPromises)))
            const { _props } = node.meta
            for (const key of Object.keys(_props))
                _props[key] = await evaluateMeta(
                    _props[key],
                    context.tempPath + '-' + key,
                    relativePath + '-' + key,
                )
        }
    })
    await Promise.all(promises)
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
    const meta = {}
    // todo can we get rid of this div? It won't parse files with only comments in them
    const content = '<div />' + (await readFile(filepath, 'utf-8'))
    const $ = cheerio.load(content)

    const comments = $('*')
        .contents()
        .filter((i, el) => el.type === 'comment')
    comments.each((i, c) => Object.assign(meta, parseComment(c.data)))
    return meta
}

/**
 * reads meta from <filename>.meta.js files
 * @param {string} filepath file to check for sibling meta file
 */
export const externalMeta = (filepath, context) => {
    const metaFilePath = filepath.replace(/(.+)\.[^.]+$/, '$1.meta.js')

    if (existsSync(metaFilePath)) {
        const path = './' + relative(__dirname, metaFilePath)
        return import(path).then(r => r.default(context))
    }
}

/**
 * @typedef {object} MetaObject
 * @prop {function} value
 * @prop {boolean} [split=false]
 * @prop {boolean} [scoped=false]
 */

/**
 *
 * @param {Object.<string, (MetaObject)>} meta
 */
const evaluateMeta = async (meta, tempPath, relativePath) => {
    if (typeof meta.value === 'undefined') meta = { value: meta }
    if (meta.split) {
        split(meta.value, tempPath + '-split.js')
        meta.value = `()=> import('./${relativePath}-split.js').then(r => r.default)::_EVAL`
    }
    return meta
}
