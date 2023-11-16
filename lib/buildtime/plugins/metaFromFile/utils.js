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

const reservedMetaKeys = [
    'recursive',
    'bundle',
    'reset',
    'order',
    'name',
    'inline',
    'isDefault',
    'history',
]

/**
 *
 * @param {{node:RNodeBuildtime, meta: Object}[]} meta
 * @param {string[]|false|true} ignoreMetaConflictWarnings
 */
export const printReservedWarnings = (meta, ignoreMetaConflictWarnings) => {
    const ignoredConflicts = Array.isArray(ignoreMetaConflictWarnings)
        ? ignoreMetaConflictWarnings
        : []
    const isIgnored = key => [...reservedMetaKeys, ...ignoredConflicts].includes(key)
    const potentialConflicts = []
    if (ignoreMetaConflictWarnings !== true)
        meta.forEach(({ node, meta }) => {
            Object.keys(meta).forEach(key => {
                if (!key.match('_') && !isIgnored(key))
                    potentialConflicts.push(`- "${key}" found in "${node.file.path}"`)
            })
        })
    if (potentialConflicts.length) logs.metaKeysWarning(potentialConflicts)
}
