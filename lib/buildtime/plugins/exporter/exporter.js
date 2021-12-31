import { resolve } from 'path'
import { stringifyWithEscape } from '../../utils.js'

/** @param {{instance: RoutifyBuildtime}} param0 */
export const exporter = ({ instance }) => {
    const promises = Object.values(instance.rootNodes).map(async rootNode => {
        /** @ts-ignore */
        rootNode.routifyDir = 'import.meta.url::_EVAL'
        await exportNode(rootNode, instance.options.routifyDir)
        await exportInstance(rootNode, instance.options.routifyDir)
    })
    return Promise.all(promises)
}

/**
 *
 * @param {RNode} rootNode
 * @param {string} outputDir
 */
export const exportNode = async (rootNode, outputDir) => {
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
    await rootNode.instance.writeFile(outputPath, content)
}

/**
 * creates instance.default.js
 * @param {RNode} rootNode
 * @param {String} outputDir
 */
export const exportInstance = async (rootNode, outputDir) => {
    /** @ts-ignore rootName */
    const outputPath = resolve(outputDir, `instance.${rootNode.rootName}.js`)

    const content = [
        `import { Routify, Router } from '@roxi/routify'`,
        /** @ts-ignore rootName */
        `import routes from './routes.${rootNode.rootName}.js'`,
        '',
        'export const router = new Routify({routes})',
        'export { Router, routes, router }',
        '',
    ]
    await rootNode.instance.writeFile(outputPath, content.join('\n'))
}
