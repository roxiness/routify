import { Node } from '../../common/Node.js' //eslint-disable-line
import { Routify } from '../../common/Routify.js' //eslint-disable-line
import { relative, resolve } from 'path'
import fse from 'fs-extra'

/** @param {{instance: Routify}} param0 */
export const exporter = ({ instance }) => {
    const promises = instance.superNode.children.map((rootNode) =>
        exportNode(rootNode, instance.options.routifyDir),
    )
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
 * @param {Node} rootNode
 * @param {string} outputDir
 */
export const exportNode = (rootNode, outputDir) => {
    // create imports
    const imports = [rootNode, ...rootNode.descendants]
        .filter(
            (node) => node.component && !node.component.startsWith('import('),
        )
        .map(
            (node) =>
                `import ${node.id} from '${relative(
                    outputDir,
                    node.component,
                ).replace(/\\/g, '/')}'`,
        )
        .join('\n')

    // set component to id
    ;[rootNode, ...rootNode.descendants]
        .filter(
            (node) => node.component && !node.component.startsWith('import('),
        )
        .forEach((node) => (node.component = node.id))

    const treeString = stringifyWithEscape(rootNode.map, ['component'])
    const outputPath = resolve(outputDir, `routes.${rootNode.rootName}.js`)
    const content = [imports, `export const routes = ${treeString}`].join(
        '\n\n',
    )

    fse.outputFileSync(outputPath, content)
}
