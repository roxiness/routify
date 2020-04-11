import { createNodeMiddleware } from '../../lib/utils/middleware'
import { pathToParams, pathToRank, pathToRegex } from '../utils'

export const setRegex = createNodeMiddleware(({ file }) => {
    if (file.isPage || file.isFallback)
        file.regex = pathToRegex(file.path, file.isFallback)
})
export const setParamKeys = createNodeMiddleware(({ file }) => {
    file.paramKeys = pathToParams(file.path)
})

export const setShortPath = createNodeMiddleware(({ file }) => {
    if (file.isFallback || file.isIndex)
        file.shortPath = file.path.replace(/\/[^/]+$/, '')
    else file.shortPath = file.path
})
export const setRank = createNodeMiddleware(({ file }) => {
    file.ranking = pathToRank(file)
})


// todo delete?
export const addMetaChildren = createNodeMiddleware(({ file }) => {
    const node = file
    const metaChildren = file.meta && file.meta.children || []
    if (metaChildren.length) {
        node.children = node.children || []
        node.children.push(...metaChildren.map(meta => ({ isMeta: true, ...meta, meta })))
    }
})

export const setIsIndexable = createNodeMiddleware(payload => {
    const { file } = payload
    const { isLayout, isFallback, meta } = file
    file.isIndexable = !isLayout && !isFallback && meta.index !== false
    file.isNonIndexable = !file.isIndexable
})


export const assignRelations = createNodeMiddleware(({ file, parent }) => {
    Object.defineProperty(file, 'parent', { get: () => parent })
    Object.defineProperty(file, 'nextSibling', { get: () => _getSibling(file, 1) })
    Object.defineProperty(file, 'prevSibling', { get: () => _getSibling(file, -1) })
    Object.defineProperty(file, 'lineage', { get: () => _getLineage(parent) })
})

function _getLineage(node, lineage = []){
    if(node){
        lineage.unshift(node)
        _getLineage(node.parent, lineage)
    }
    return lineage
}

/**
 * 
 * @param {RouteNode} file 
 * @param {Number} direction 
 */
function _getSibling(file, direction) {
    if (!file.root) {
        const siblings = file.parent.children.filter(c => c.isIndexable)
        const index = siblings.indexOf(file)
        return siblings[index + direction]
    }
}

export const assignIndex = createNodeMiddleware(({ file, parent }) => {
    if (file.isIndex) Object.defineProperty(parent, 'index', { get: () => file })
    if (file.isLayout)
        Object.defineProperty(parent, 'layout', { get: () => file })
})

export const assignLayout = createNodeMiddleware(({ file, scope }) => {
    Object.defineProperty(file, 'layouts', { get: () => getLayouts(file) })
    function getLayouts(file) {
        const { parent } = file
        const layout = parent && parent.layout
        const isReset = layout && layout.isReset
        const layouts = (parent && !isReset && getLayouts(parent)) || []
        if (layout) layouts.push(layout)
        return layouts
    }
})


export const createFlatList = treePayload => {
    createNodeMiddleware(payload => {
        if (payload.file.isPage || payload.file.isFallback)
        payload.state.treePayload.routes.push(payload.file)
    }).sync(treePayload)    
    treePayload.routes.sort((c, p) => (c.ranking >= p.ranking ? -1 : 1))
}

export const setPrototype = createNodeMiddleware(({ file }) => {
    const Prototype = file.root
        ? Root
        : file.children
            ? file.isFile ? PageDir : Dir
            : file.isReset
                ? Reset
                : file.isLayout
                    ? Layout
                    : file.isFallback
                        ? Fallback
                        : Page
    Object.setPrototypeOf(file, Prototype.prototype)

    function Layout() { }
    function Dir() { }
    function Fallback() { }
    function Page() { }
    function PageDir() { }
    function Reset() { }
    function Root() { }
})
