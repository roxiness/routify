import { createNodeMiddleware } from '../middleware'
import { pathToParamKeys, pathToRank, pathToRegex } from '../utils'

export const setRegex = createNodeMiddleware(({ file }) => {
    if (file.isPage || file.isFallback)
        file.regex = pathToRegex(file.path, file.isFallback)
})
export const setParamKeys = createNodeMiddleware(({ file }) => {
    file.paramKeys = pathToParamKeys(file.path)
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
    const { isFallback, meta } = file
    const isDynamic = file.path.split('/').pop().startsWith(':')
    const isIndex = file.path.endsWith('/index')
    const isIndexed = meta.index || meta.index === 0
    const isHidden = meta.index === false

    file.isIndexable = isIndexed || (!isFallback && !isDynamic && !isIndex && !isHidden)
    file.isNonIndexable = !file.isIndexable
})

export const assignRelations = createNodeMiddleware(({ file, parent }) => {
    Object.defineProperty(file, 'parent', { get: () => parent })
    Object.defineProperty(file, 'nextSibling', { get: () => _getSibling(file, 1) })
    Object.defineProperty(file, 'prevSibling', { get: () => _getSibling(file, -1) })
    Object.defineProperty(file, 'lineage', { get: () => _getLineage(parent) })
})

function _getLineage(node, lineage = []) {
    if (node) {
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
})

export const assignLayout = createNodeMiddleware(({ file, scope }) => {
    // create a layouts getter
    Object.defineProperty(file, 'layouts', { get: () => getLayouts(file) })

    /**
     * returns a list of layouts by recursively traversing the AST ancestry
     * @param {RouteNode} file 
     * @returns {RouteNode[]}
     */
    function getLayouts(file) {
        // if this isn't a layout and it's reset, return an empty array
        if (!file.isLayout && file.meta.reset) return []

        const { parent } = file
        const layout = parent && parent.component && parent
        const isReset = layout && (layout.isReset || layout.meta.reset)
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
            ? file.isPage ? PageDir : Dir
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
