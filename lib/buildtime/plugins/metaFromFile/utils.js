import { existsSync } from 'fs'
import { writeFileIfDifferentSync } from '../../../buildtime/utils.js'
import { resolve } from 'path'
import { logs } from '../../logMsgs.js'

// todo should be used

/**
 * caches result of a function and returns cached value on subsequent calls
 * @param {function} fn
 * @param {string} path
 * @param {boolean=} refresh
 */
const cached = async (fn, path, refresh) => {
    if (!existsSync(path) || refresh) {
        let value = await fn()
        value = value instanceof Function ? value.toString() : JSON.stringify(value)
        writeFileIfDifferentSync(path, `export default ${value}`)
        return eval(value)
    }
    return import('file:///' + resolve(path)).then(r => r.default)
}

const routifyKeys = [
    'recursive',
    'bundle',
    'reset',
    'order',
    'name',
    'inline',
    'isDefault',
    'history',
    'noRoute',
    'title',
    'children',
]

/**
 *
 * @param {{node:RNodeBuildtime, meta: Object}[]} meta
 * @param {RoutifyBuildtime} instance
 */
export const printReservedWarnings = (meta, instance) => {
    if (instance.options.ignoreMetaConflictWarnings !== true) {
        const ignoredKeys = instance.options.ignoreMetaConflictWarnings || []
        const pluginKeys = [
            ...instance.plugins.map(p => p.reservedMetaKeys).flat(),
        ].filter(Boolean)

        const isIgnored = key =>
            [...routifyKeys, ...pluginKeys, ...ignoredKeys].includes(key)

        const potentialConflicts = []
        meta.forEach(({ node, meta }) => {
            Object.keys(meta).forEach(key => {
                if (!key.match('_') && !isIgnored(key))
                    potentialConflicts.push(`- "${key}" found in "${node.file.path}"`)
            })
        })
        if (potentialConflicts.length) {
            logs.metaKeysWarning(potentialConflicts)
        }
    }
}
