export function setIsIndexable({ tree }) {
    tree.isIndexable = isIndexable(tree)
    tree.isNonIndexable = !tree.isIndexable
}

export function assignRelations({ tree, prevFiles, parent }) {
    
    const prevFile = prevFiles.reverse().find(t => t.isIndexable)
    if (prevFile && tree.isIndexable) {
        Object.defineProperty(tree, 'prevSibling', { get: () => prevFile })
        Object.defineProperty(prevFile, 'nextSibling', { get: () => tree })
    }
    if (parent) Object.defineProperty(tree, 'parent', { get: () => parent })
}

export function assignIndex({ tree, parent }) {
    if (tree.isIndex) Object.defineProperty(parent, 'index', { get: () => tree })
    if (tree.isLayout)
        Object.defineProperty(parent, 'layout', { get: () => tree })
}

export function assignLayout({ tree }) {
    Object.defineProperty(tree, 'layouts', { get: () => getLayouts(tree) })
    Object.defineProperty(tree, 'prettyName', {
        get: () => _prettyName(tree)
    })
}

export function assignIndexables({ tree }) {
    Object.defineProperty(tree, 'indexables', {
        get: () => {
            const children = (tree.children || []).filter(c => c.isIndexable)
            const metas = tree.meta.indexables || []
            return [...children, ...metas]
        }
    })
}

export function setPrototype({tree}) {
    const Prototype = !tree.parent
        ? Root
        : tree.children
            ? Dir
            : tree.isReset
                ? Reset
                : tree.isLayout
                    ? Layout
                    : tree.isFallback
                        ? Fallback
                        : Page
    Object.setPrototypeOf(tree, Prototype.prototype)

    function Layout() { }
    function Dir() { }
    function Fallback() { }
    function Page() { }
    function Reset() { }
    function Root() { }
}


function isIndexable(file) {
    const { isLayout, isFallback, meta } = file
    return !isLayout && !isFallback && meta.index !== false
}

function getLayouts(file) {
    const { parent } = file
    const layout = parent && parent.layout
    const isReset = layout && layout.isReset
    const layouts = (parent && !isReset && getLayouts(parent)) || []
    if (layout) layouts.push(layout)
    return layouts
}

function _prettyName(tree) {
    return tree.meta.name ||
        (tree.shortPath || tree.path)
            .split('/')
            .pop()
            .replace(/-/g, ' ')
}

