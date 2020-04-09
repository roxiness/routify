import { createNodeMiddleware } from '../../lib/utils/middleware'
import { pathToParams, pathToRank, pathToRegex } from '../utils'

export const setRegex = createNodeMiddleware(({ file }) => {
    if (file.isPage || file.isFallback)
        file.regex = pathToRegex(file.path, file.isFallback)
})
export const setParams = createNodeMiddleware(({ file }) => {
    file.paramKeys = pathToParams(file.path)
})
export const setName = createNodeMiddleware(({ file }) => {
    if (file.isPage || file.isFallback)
        file.name = file.path.match(/[^\/]*\/[^\/]+$/)[0].replace(/[^\w\/]/g, '') //last dir and name, then replace all but \w and /
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
})

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


export const createFlatList = createNodeMiddleware(payload => {
    if (payload.file.isPage || payload.file.isFallback)
        payload.state.treePayload.routes.push(payload.file)
})

export const setPrototype = createNodeMiddleware(({ file }) => {
    const Prototype = !file.parent
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

export const assignAPI = createNodeMiddleware(({ file }) => { file.api = new ClientApi(file) })

class ClientApi {
    constructor(file) {
        this.__file = file
        Object.defineProperty(this, '__file', { enumerable: false })
        this.isMeta = !!file.isMeta
        this.path = file.path
        this.title = _prettyName(file)
        this.meta = file.meta
    }

    get parent() { return !this.__file.root && this.__file.parent.api }
    get children() {
        return (this.__file.children || this.__file.isLayout && this.__file.parent.children || [])
            .filter(c => !c.isNonIndexable)
            .sort((a, b) => a.meta.index - b.meta.index)
            .map(({ api }) => api)
    }
    get next() { return _navigate(this, +1) }
    get prev() { return _navigate(this, -1) }
}

function _navigate(node, direction) {
    if (!node.__file.root) {
        const siblings = node.parent.children
        const index = siblings.indexOf(node)
        return node.parent.children[index + direction]
    }
}




function _prettyName(file) {
    if (typeof file.meta.title !== 'undefined') return file.meta.title
    else return (file.shortPath || file.path)
        .split('/')
        .pop()
        .replace(/-/g, ' ')
}

