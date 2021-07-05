export default {
    name: 'indexByName',
    before: 'exporter',
    options: { delimiter: '.' },
    build: ({ instance, options }) => {
        const RE = `^(\\d+)\\${options.delimiter}(.+)`

        instance.nodeIndex.forEach(node => {
            const matches = node.name?.match(RE)
            if (matches) {
                const [, index, name] = matches
                node.name = name
                node.meta.index = index
            }
        })
    },
}
