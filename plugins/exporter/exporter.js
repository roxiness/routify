import { Node } from '../../lib/Node.js' //eslint-disable-line
import { Routify } from '../../lib/Routify.js' //eslint-disable-line
import { relative, resolve } from 'path'
import fse from 'fs-extra'


/** @param {{instance: Routify}} param0 */
export const exporterPlugin = ({ instance }) => {
    // console.log(instance.superNode.children)
}

/**
 * JSON.stringify wrapper that leaves specified keys unquoted
 * @param {any} obj
 * @param {string[]} keys
 * @returns {string}
 */
const stringifyWithEscape = (obj, keys) => {
    const re = new RegExp(`^( *)"(${keys.join('|')})": "(.+)"`, 'gm')
    return JSON.stringify(obj, null, 2)
        .replace(re, '$1"$2": $3')
}

/**
 *
 * @param {Node} rootNode
 * @param {string} outputDir
 */
export const exporter = (rootNode, outputDir) => {
    const imports = [rootNode, ...rootNode.descendants]
        .filter(node => node.component)
        .map(node => `import ${node.id} from '${relative(outputDir, node.component).replace(/\\/g, '/')}'`)
        .join('\n');

    [rootNode, ...rootNode.descendants].forEach(node => node.component = node.id)

    const tree = stringifyWithEscape(rootNode.map, ['component'])

    fse.outputFileSync(resolve(outputDir, `routes.${rootNode.rootName}.js`), `${imports}\n\n${tree}`)
}