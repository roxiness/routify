// todo should be unified with build plugin namedModule

const parseModuleName = str => {
    const matches = str.match(/^(.+?)(\+)?$/)
    const [, name, prepend] = matches
    return { name, prepend }
}

const handlers = {
    /**
     * @param {Route} route
     * @param {Boolean} bool
     * @param {RouteFragment} fragment
     */
    boolean(route, bool, fragment) {
        const index = fragment.index
        return handlers.number(route, index, fragment)
    },
    /**
     * @param {Route} route
     * @param {Number} num
     * @param {RouteFragment} fragment
     */
    number(route, num, fragment) {
        const index = fragment.index
        const start = index - num
        route.allFragments.splice(start, num)
    },
    /**
     * @param {Route} route
     * @param {string} str
     * @param {RouteFragment} fragment
     */
    string(route, str, fragment) {
        const selfIndex = fragment.index
        const precedingFragments = route.allFragments.slice(0, selfIndex + 1)
        /** @type {RouteFragment} */
        let nextFragment

        const { name, prepend } = parseModuleName(str)
        while (precedingFragments.length) {
            nextFragment = precedingFragments.pop()
            const matchingSiblingNode = nextFragment.node.children.find(
                node => node.meta.moduleName === name,
            )
            if (matchingSiblingNode) {
                if (!prepend) route.allFragments.splice(0, fragment.index)
                route.allFragments.unshift(route.createFragment(matchingSiblingNode))
                precedingFragments.splice(0)
            }
        }
    },
}

/**
 *
 * @param {Route} route
 * @returns {(fragment: RouteFragment) => void}
 */
const handleFragment = route => fragment => {
    const { reset } = fragment.node.meta
    if (reset) handlers[typeof reset](route, reset, fragment)
}

/**
 * Removes parent modules from a node
 *  @returns {RoutifyRuntimePlugin}
 **/
export default () => {
    return {
        beforeUrlChange: ({ route }) => {
            const fragments = [...route.allFragments]
            fragments.forEach(handleFragment(route))
            return true
        },
    }
}
