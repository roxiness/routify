/**
 * !WARNING! Experimental plugin. The API will change.
 * Creates a localized routes file for each `lang-<lang>` entry in the `routesDir` option.
 * Each localized routes file contains only the routes for that language.
 * To localize a file, add the language to the end of the file name, eg. `about.en.svelte`.
 * @example
 * const routifyConfig = {
 *   plugins: [i18nPlugin()],
 *   routesDir: {
 *     'default': 'src/routes',
 *     'lang-en': 'src/routes',
 *     'lang-de': 'src/routes',
 *   },
 * }
 * @returns RoutifyBuildtimePlugin
 */
export const i18nPlugin = () => ({
    name: 'i18n',
    after: 'metaFromFile',
    before: 'exporter',
    build: async ctx => {
        // get all languages from rootNode names, ie. names from routify.options.routesDir that start with 'lang-'
        const languages = Object.keys(ctx.instance.rootNodes)
            .filter(name => name.startsWith('lang-'))
            .map(name => name.replace(/^lang-/, ''))

        // iterate over each rootNode starting with 'lang-'
        Object.entries(ctx.instance.rootNodes)
            .filter(([name]) => name.startsWith('lang-'))
            .forEach(([name, rootNode]) => {
                const lang = name.replace(/^lang-/, '')

                rootNode.descendants.forEach(node => {
                    // if node.name ends with the current rootNode language
                    // remove the language from the name and remove the corresponding node
                    if (node.name.endsWith(`.${lang}`)) {
                        const newName = node.name.replace(`.${lang}`, '')
                        // remove old node
                        try {
                            node.parent.traverse(`./${newName}`).remove()
                        } catch (e) {
                            const err = `[Routify 3] Node "%s" does not have a corresponding "%s" node.`
                            if (e.message.match('could not travel to'))
                                console.log(err, node.file.path, newName + node.file.ext)
                        }

                        node.name = newName
                    }

                    // else if node.name ends with one of the other languages
                    // remove the node
                    else if (languages.some(lang => node.name.endsWith(`.${lang}`))) {
                        node.parent.traverse(`./${node.name}`).remove()
                    }
                })
            })
    },
})
