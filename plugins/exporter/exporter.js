import { relative, resolve } from 'path'
import fse from 'fs-extra'
import '../../typedef.js'
import { createDirname } from '../../lib/utils.js'
const __dirname = createDirname(import.meta)

/** @param {{instance: Routify}} param0 */
export const exporter = ({ instance }) => {
    const promises = instance.superNode.children.map(rootNode => {
        exportNode(rootNode, instance.options.routifyDir)
        exportInstance(rootNode, instance.options.routifyDir)
    })
    return Promise.all(promises)
}

/**
 * JSON.stringify wrapper that leaves specified keys unquoted
 * @param {any} obj
 * @param {string[]} keys
 * @returns {string}
 */
const stringifyWithEscape = (obj, keys) => {
    const re = new RegExp(`^( *)"(${keys.join('|')})": (".+")`, 'gm')
    return JSON.stringify(obj, null, 2).replace(
        re,
        (m, spaces, key, value) => `${spaces}"${key}": ${JSON.parse(value)}`,
    )
}

/**
 *
 * @param {RNode} rootNode
 * @param {string} outputDir
 */
export const exportNode = (rootNode, outputDir) => {
    // create imports
    const imports = [rootNode, ...rootNode.descendants]
        .filter(node => node.component && !node.component.startsWith('import('))
        .filter(node => !node.meta.async)
        .map(
            node =>
                `import ${node.id} from '${relative(
                    outputDir,
                    node.component,
                ).replace(/\\/g, '/')}'`,
        )
        .join('\n')

    // set component to either id or import(component).then(r => r.default)
    ;[rootNode, ...rootNode.descendants]
        .filter(node => node.component && !node.component.startsWith('import('))
        .forEach(node => {
            if (node.meta.async)
                node.component = `import(${node.component}).then(r => r.default)`
            else node.component = node.id
        })

    const treeString = stringifyWithEscape(rootNode.map, ['component'])

    // prettier-ignore
    const content =
        `${imports}` +
        '\n' +
        '\n' +
        `export const routes = ${treeString}`

    const outputPath = resolve(outputDir, `routes.${rootNode.rootName}.js`)
    fse.outputFileSync(outputPath, content)
}

export const exportInstance = (rootNode, outputDir) => {
    const outputPath = resolve(outputDir, `instance.${rootNode.rootName}.js`)
    const relativeRoutifyPath = relative(
        outputDir,
        resolve(__dirname + '../../runtime/index.js'),
    ).replace(/\\/g, '/')

    const content = [
        `import { Routify, Router } from '${relativeRoutifyPath}'`,
        `import {routes} from './routes.${rootNode.rootName}.js'`,
        '',
        'export const instance = new Routify({routes})',
        'export { Router }',
        '',
    ]

    fse.outputFileSync(outputPath, content.join('\n'))
}
