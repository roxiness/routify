import { Node } from '../../common/Node.js' //eslint-disable-line
import { Routify } from '../../common/Routify.js' //eslint-disable-line
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

const setComponentToId = node => node.component = node.component ? node.id : null

/**
 *
 * @param {Node} rootNode
 * @param {string} outputDir
 */
export const exporter = (rootNode, outputDir) => {
    // create imports
    const imports = [rootNode, ...rootNode.descendants]
        .filter(node => node.component)
        .map(node => `import ${node.id} from '${relative(outputDir, node.component).replace(/\\/g, '/')}'`)
        .join('\n');

    // set component to id
    [rootNode, ...rootNode.descendants].forEach(setComponentToId)

    const treeString = stringifyWithEscape(rootNode.map, ['component'])
    const outputPath = resolve(outputDir, `routes.${rootNode.rootName}.js`)
    const content = [
        imports ,
        `export const routes = ${treeString}`
    ]
        .join('\n\n')

    fse.outputFileSync( outputPath, content )
}