/*
    Always omit
    <!-- routify:meta omit -->

    Omit in production
    <!-- routify:meta omit="production" -->

    Omit in multiple environments
    <!-- routify:meta omit=["production", "staging"]
 */

const coerceArray = val => (Array.isArray(val) ? val : [val])
const crossMatch = (a, b) => a.some(x => b.includes(x))

/** @type {RoutifyBuildtimePlugin} */
export const omitNodePlugin = {
    name: 'omitNode',
    after: 'filemapper',
    before: 'exporter',
    build: ({ instance }) => {
        instance.nodeIndex.forEach(node => {
            const omits = coerceArray(node.meta.omit)
            const conditions = [process.env.NODE_ENV, true]
            if (crossMatch(omits, conditions)) node.remove()
        })
    },
}
