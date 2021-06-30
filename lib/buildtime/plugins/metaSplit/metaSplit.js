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
 * @param {string} tempPath
 * @param {string} relativePath
 * @returns
 */
const evaluateMeta = async (meta, tempPath, relativePath) => {
    if (typeof meta.value === 'undefined') meta = { value: meta }
    if (meta.split) {
        split(meta.value, tempPath + '-split.js')
        meta.value = `()=> import('./${relativePath}-split.js').then(r => r.default)::_EVAL`
    }
    return meta
}

export const metaSplit = async ({ instance }) => {
    const promises = instance.nodeIndex.map(async node => {
        const relativePath = 'cached/' + node.file?.path

        const context = {
            instance,
            options: instance.options,
            tempPath: instance.options.routifyDir + '/' + relativePath,
        }

        const { _props } = node.meta
        for (const key of Object.keys(_props))
            _props[key] = await evaluateMeta(
                _props[key],
                context.tempPath + '-' + key,
                relativePath + '-' + key,
            )
    })

    await Promise.all(promises)
}
