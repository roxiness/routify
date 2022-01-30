/** @returns {RoutifyRuntimePlugin} */
export default () => ({
    beforeUrlChange: ({ route }) => {
        const fragments = route.allFragments

        fragments.forEach(fragment => {
            const { reset } = fragment.node.meta
            if (reset) {
                const index = fragments.indexOf(fragment)
                const deleteCount = reset === true ? index : Number(reset)
                const start = index - deleteCount
                fragments.splice(start, index)
            }
        })
        return true
    },
})
