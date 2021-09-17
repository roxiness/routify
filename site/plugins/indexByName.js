const defaults = { delimiter: '.' }

/**
 * Orders components by their prefixed number
 */
export default options => ({
    name: 'indexByName',
    before: 'exporter',
    build: ({ instance }) => {
        const cfg = { ...defaults, ...options }
        const RE = `^(\\d+)\\${cfg.delimiter}(.+)`

        instance.nodeIndex.forEach(node => {
            const matches = node.name?.match(RE)
            if (matches) {
                // use number prefix as order and omit the prefix from the route name
                const [, order, name] = matches
                node.name = name
                node.meta.order = Number(order)
            }
        })
    },
})
