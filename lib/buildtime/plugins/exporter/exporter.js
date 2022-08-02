import { resolve } from 'path'
import { stringifyWithEscape } from '../../utils.js'

/** @param {{instance: RoutifyBuildtime}} param0 */
export const exporter = ({ instance }) => {
    const promises = Object.values(instance.rootNodes).map(async rootNode => {
        /** @ts-ignore */
        rootNode.routifyDir = 'import.meta.url::_EVAL'
        await exportNode(rootNode, instance.options.routifyDir)
        await exportInstance(rootNode, instance.options.routifyDir)
        await exportRender(rootNode, instance.options.routifyDir)
        if (!instance.options.watch)
            await exportSitemap(rootNode, instance.options.routifyDir)
    })
    return Promise.all(promises)
}

/**
 *
 * @param {RNodeBuildtime} rootNode
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
 * @param {RNodeBuildtime} rootNode
 * @param {String} outputDir
 */
export const exportInstance = async (rootNode, outputDir) => {
    /** @ts-ignore rootName */
    const outputPath = resolve(outputDir, `instance.${rootNode.rootName}.js`)

    const content = [
        `import { Router, createRouter } from '@roxi/routify'`,
        /** @ts-ignore rootName */
        `import routes from './routes.${rootNode.rootName}.js'`,
        '',
        'export const router = createRouter({routes})',
        'export { Router, routes }',
        '',
    ]
    await rootNode.instance.writeFile(outputPath, content.join('\n'))
}

export const exportSitemap = async (rootNode, outputDir) => {
    const flattenNodes = node => [node, ...node.children.map(flattenNodes).flat()]

    const outputPath = resolve(outputDir, `sitemap.${rootNode.rootName}.txt`)

    const content = flattenNodes(rootNode)
        .filter(node => !node.meta?.dynamic)
        .map(node => node.path)
    await rootNode.instance.writeFile(outputPath, content.join('\n'))
}

/**
 * Exports a render function for SSR
 * @param {RNode} rootNode
 * @param {string} outputDir
 */
export const exportRender = async (rootNode, outputDir) => {
    const body = `
        import * as module from '../src/App.svelte'
        import { renderModule } from '@roxi/routify/tools'

        export const render = url => renderModule(module, url)`

    const outputPath = resolve(outputDir, `render.js`)

    await rootNode.instance.writeFile(outputPath, body)
}
