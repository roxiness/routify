// todo should be unified with build plugin namedModule

const parseModuleName = str => {
    const matches = str.match(/^(.+?)(\+)?$/)
    const [, name, prepend] = matches
    return { name, prepend }
}

const createHandlers = (fragments, route) => {
    const getIndexOf = fragment => fragments.indexOf(fragment)
    const handlers = {
        /**
         * @param {Boolean} _bool
         * @param {RouteFragment} fragment
         */
        boolean(_bool, fragment) {
            const index = getIndexOf(fragment)
            return handlers.number(index, fragment)
        },
        /**
         * @param {Number} num
         * @param {RouteFragment} fragment
         */
        number(num, fragment) {
            const index = fragments.indexOf(fragment)
            const start = index - num
            fragments.splice(start, num)
        },
        /**
         * @param {string} str
         * @param {RouteFragment} fragment
         */
        string(str, fragment) {
            const selfIndex = getIndexOf(fragment)
            const precedingFragments = fragments.slice(0, selfIndex + 1)
            /** @type {RouteFragment} */
            let nextFragment

            const { name, prepend } = parseModuleName(str)
            while (precedingFragments.length) {
                nextFragment = precedingFragments.pop()
                const matchingSiblingNode = nextFragment.node.navigableChildren.find(
                    node => node.meta.moduleName === name,
                )
                if (matchingSiblingNode) {
                    if (!prepend) fragments.splice(0, getIndexOf(fragment))
                    fragments.unshift(route.createFragment(matchingSiblingNode))
                    precedingFragments.splice(0)
                }
            }
        },
    }
    return handlers
}

/**
 *
 * @param {ReturnType<createHandlers>} handlers
 * @returns {(fragment: RouteFragment) => void}
 */
const handleFragment = handlers => fragment => {
    const { reset } = fragment.node.meta
    if (reset) handlers[typeof reset](reset, fragment)
}

/**
 * Removes parent modules from a node
 *  @returns {RoutifyRuntimePlugin}
 **/
export default () => ({
    transformFragments: _fragments => {
        const { route } = _fragments[0]
        const fragments = [..._fragments]
        const handlers = createHandlers(fragments, route)
        _fragments.forEach(handleFragment(handlers))
        return fragments
    },
})
