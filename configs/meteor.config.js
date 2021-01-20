module.exports = {
    name: 'Routify',
    condition: ({ pkgjson }) => pkgjson.dependencies['meteor-node-stubs'],
    config: () => {
        return {
            "pages": "imports/ui/pages",
            "routifyDir": "imports/routify"
        }
    }
}