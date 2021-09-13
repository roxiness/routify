import { isObjectOrArray } from '#lib/common/utils.js'
import { split } from './utils.js'

/**
 * @typedef {object} MetaObject
 * @prop {function} value
 * @prop {boolean} [split=false]
 * @prop {boolean} [scoped=false]
 */

/**
 *
 * @param {Object.<string, (MetaObject)>} meta
 * @param {string} relativePath
 * @param {string} routifyDir
 * @returns
 */
const evaluateMeta = async (meta, relativePath, routifyDir) => {
    if (meta.split) {
        if (typeof meta.value === 'undefined') meta = { value: meta }
        split(meta.value, `${routifyDir}/${relativePath}-split.js`)
        meta.value = `()=> import('./${relativePath}-split.js').then(r => r.default)::_EVAL`
    }
    return meta
}

export const metaSplit = async ({ instance }) => {
    const promises = instance.nodeIndex.map(async node => {
        const relativePath = `cached/${node.file?.path}`
        const routifyDir = instance.options.routifyDir

        await traverseObject(node.meta._props, relativePath, routifyDir)
    })

    await Promise.all(promises)
}

const traverseObject = async (_props, relativePath, routifyDir) => {
    const promises = Object.keys(_props).map(async key => {
        if (isObjectOrArray(_props[key])) {
            await traverseObject(_props[key], `${relativePath}_${key}`, routifyDir)

            _props[key] = await evaluateMeta(
                _props[key],
                relativePath + '-' + key,
                routifyDir,
            )
        }
    })
    await Promise.all(promises)
}
