import { stringifyWithEscape } from '../../utils.js'

const routesFileName = rootNode => `routes.${rootNode.rootName}.js`

/** @param {{instance: RoutifyBuildtime}} param0 */
export const exporter = ({ instance }) => {
    const routeTreePromises = Object.values(instance.rootNodes).map(async rootNode => {
        /** @ts-ignore */
        rootNode.routifyDir = 'import.meta.url::_EVAL'
        await exportNode(rootNode)
        await exportInstance(rootNode)
        if (!instance.options.watch) await exportSitemap(rootNode)
    })
    const toolsPromises = [
        exportRender(instance),
        exportRoutifyInit(instance),
        exportRouteMap(instance),
    ]
    return Promise.all([...routeTreePromises, ...toolsPromises])
}

/**
 *
 * @param {RNodeBuildtime} rootNode
 */
export const exportNode = async rootNode => {
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

    const outputPath = routesFileName(rootNode)
    await rootNode.instance.writeFile(outputPath, content)
}

/**
 * creates instance.default.js
 * @param {RNodeBuildtime} rootNode
 */
export const exportInstance = async rootNode => {
    /** @ts-ignore rootName */
    const outputPath = `instance.${rootNode.rootName}.js`

    const content = [
        `import { Router, createRouter } from '@roxi/routify'`,
        `import routes from './${routesFileName(rootNode)}'`,
        '',
        'export const router = createRouter({routes})',
        'export { Router, routes }',
        '',
    ]
    await rootNode.instance.writeFile(outputPath, content.join('\n'))
}

export const exportSitemap = async rootNode => {
    const flattenNodes = node => [node, ...node.children.map(flattenNodes).flat()]

    const outputPath = `sitemap.${rootNode.rootName}.txt`

    const content = flattenNodes(rootNode)
        .filter(node => !node.meta?.dynamic)
        .map(node => node.path)
    await rootNode.instance.writeFile(outputPath, content.join('\n'))
}

/**
 * Exports a render function for SSR
 * @param {RoutifyBuildtime} instance
 */
export const exportRender = async instance => {
    const body = `
        import * as module from '../src/App.svelte'
        import { renderModule } from '@roxi/routify/tools'
        import { map } from './route-map.js'

        export const render = url => renderModule(module, { url, routesMap: map })`

    await instance.writeFile('render.js', body)
}

/**
 * Exports a render function for SSR
 * @param {RoutifyBuildtime} instance
 */
export const exportRoutifyInit = async instance => {
    const body = `
import { appInstance, preloadUrl } from '@roxi/routify'
import { map } from './route-map.js'

appInstance.routeMaps = map

// We need to import the App module since a router is likely declared here. This saves us pre-creating the router in the preload step below.
import * as module from '../src/App.svelte'

Promise.all([
    module.load?.(),
    // PreloadUrl parses the url and preloads each url chunk in a router that matches its name. So for '/hello;widget=/world',
    // it will preload '/hello' in the default router and '/world' in the 'widget' router.
    // If the respective routers don't exist, preloadUrl will use routesMap to pre-create a router and match it with the url chunk.
    preloadUrl({ routesMap: map })
])

export const app = import('../src/main.js')
`

    await instance.writeFile('routify-init.js', body)
}

/**
 *
 * @param { RoutifyBuildtime } instance
 */
export const exportRouteMap = instance => {
    Object.values(instance.rootNodes)
    const routeMap = Object.values(instance.rootNodes).map(
        rootNode =>
            // @ts-ignore rootName
            `${rootNode.rootName}: () => import('./${routesFileName(
                rootNode,
            )}').then(m => m.default) `,
    )
    const body = `
export const map = {
    ${routeMap.join(',\n')}
}
`
    return instance.writeFile('route-map.js', body)
}
