import { relative, resolve } from 'path'
import {
    createDirname,
    stringifyWithEscape,
    writeFileIfDifferentSync,
} from '../../utils.js'
const __dirname = createDirname(import.meta)

/** @param {{instance: RoutifyBuildtime}} param0 */
export const exporter = ({ instance }) => {
    const promises = Object.values(instance.rootNodes).map(rootNode => {
        /** @ts-ignore */
        rootNode.routifyDir = 'import.meta.url::_EVAL'
        exportNode(rootNode, instance.options.routifyDir)
        exportInstance(rootNode, instance.options.routifyDir)
    })
    return Promise.all(promises)
}

/**
 *
 * @param {RNode} rootNode
 * @param {string} outputDir
 */
export const exportNode = (rootNode, outputDir) => {
    // create imports
    let rootImport = rootNode.meta.bundle
        ? `import * as bundle_${rootNode.id} from './bundles/${rootNode.id}-bundle.js'`
        : ''

    const treeString = stringifyWithEscape(rootNode)

    // prettier-ignore
    const content =
        `${rootImport}` +
        '\n' +
        '\n' +
        `export default ${treeString}`

    /** @ts-ignore rootName*/
    const outputPath = resolve(outputDir, `routes.${rootNode.rootName}.js`)
    writeFileIfDifferentSync(outputPath, content)
}

/**
 * creates instance.default.js
 * @param {RNode} rootNode
 * @param {String} outputDir
 */
export const exportInstance = (rootNode, outputDir) => {
    /** @ts-ignore rootName */
    const outputPath = resolve(outputDir, `instance.${rootNode.rootName}.js`)
    const relativeRoutifyPath = relative(
        outputDir,
        resolve(__dirname, '../../../runtime/index.js'),
    ).replace(/\\/g, '/')

    const content = [
        `import { Routify, Router } from '${relativeRoutifyPath}'`,
        /** @ts-ignore rootName */
        `import routes from './routes.${rootNode.rootName}.js'`,
        '',
        'export const instance = new Routify({routes})',
        'export { Router }',
        '',
    ]
    writeFileIfDifferentSync(outputPath, content.join('\n'))
}
