const defaults = { delimiter: '.' }

export default options => ({
    name: 'indexByName',
    before: 'exporter',
    build: ({ instance }) => {
        const cfg = { ...defaults, ...options }
        const RE = `^(\\d+)\\${cfg.delimiter}(.+)`

        instance.nodeIndex.forEach(node => {
            const matches = node.name?.match(RE)
            if (matches) {
                const [, order, name] = matches
                node.name = name
                node.meta.order = Number(order)
            }
        })
    },
})
