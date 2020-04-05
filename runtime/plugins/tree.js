export function setIsIndexable({ file }) {
    file.isIndexable = isIndexable(file)
    file.isNonIndexable = !file.isIndexable
}

export function assignRelations({ file, prevFiles, parent }) {

    const prevFile = prevFiles.reverse().find(t => t.isIndexable)
    if (prevFile && file.isIndexable) {
        Object.defineProperty(file, 'prevSibling', { get: () => prevFile })
        Object.defineProperty(prevFile, 'nextSibling', { get: () => file })
    }
    if (parent) Object.defineProperty(file, 'parent', { get: () => parent })
}

export function assignIndex({ file, parent }) {
    if (file.isIndex) Object.defineProperty(parent, 'index', { get: () => file })
    if (file.isLayout)
        Object.defineProperty(parent, 'layout', { get: () => file })
}

export function assignLayout({ file }) {
    Object.defineProperty(file, 'layouts', { get: () => getLayouts(file) })
    Object.defineProperty(file, 'prettyName', {
        get: () => _prettyName(file)
    })
}

export function assignIndexables({ file }) {
    Object.defineProperty(file, 'indexables', {
        get: () => {
            const source = file.isLayout ? file.parent : file
            const children = (source.children || []).filter(c => c.isIndexable)
            const metas = file.meta.indexables || []
            return [...children, ...metas]
        }
    })
}

export function setPrototype({ file }) {
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

function _prettyName(file) {
    if (typeof file.meta.name !== 'undefined') return file.meta.name
    else return file.meta.name ||
        (file.shortPath || file.path)
            .split('/')
            .pop()
            .replace(/-/g, ' ')
}
