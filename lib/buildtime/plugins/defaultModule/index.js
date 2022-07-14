// import { bundler } from './bundler.js'

import { deepSet } from '../../utils.js'

/**
 * @param {RNodeBuildtime} node
 * @param {any} module
 */
const assignDefaultModule = (node, module) => {
    module = node.meta.defaultModule
        ? node.module
        : node.traverse('../_defaultModule', false, false, true)?.module || module
    node.module = node.module || module
    console.log('module', module)
    node.children.forEach(child => assignDefaultModule(child, module))
}

/** @type {RoutifyBuildtimePlugin} */
export const defaultModulePlugin = {
    name: 'defaultModule',
    after: 'filemapper',
    before: 'bundler',
    build: payload => {
        payload.instance.nodeIndex.forEach(node => {
            const name = node.file.name.match(/^_module@(.+)/)?.[1]
            if (name) {
                deepSet(node.parent, 'modules', name, 'path', node.module)
                console.log('sat', node.module, 'to', node.parent)
            }
        })
        payload.instance.nodeIndex.forEach(node => {
            if (!node.module) {
                console.log(node.id)
                const ancestor = [node, ...node.ancestors].find(
                    n => n['modules']?.default,
                )
                if (ancestor) {
                    console.log('ANCESTOR', ancestor['modules'].default.path)
                    node.module = ancestor['modules'].default.path
                }
            }
        })
    },
}
