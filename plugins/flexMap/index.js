/**
 * @typedef {Object} FlexMapPluginOptions
 * @property {Object<string, string[]>} [variationsMap] - an array of variations for each route dir.
 */

/**
 * This plugin generates a route file for each specified variation in the `variationsMap` option.
 *
 * Example:
 * If `variationsMap` is set to `{ 'default': ['en', 'de'] }`, the plugin will create two additional
 * route files: `routes.default.en.js` and `routes.default.de.js`.
 *
 * Usage:
 * - Components specific to a variation should be suffixed with the variation's key.
 *   For example, a German variation of the Home component should be named `Home.de.svelte`.
 *
 * Fallback Variations:
 * - Specify fallback variations using a comma-separated list within the array.
 *   For example, `['en-us,en-uk']` sets up a priority order for route resolution:
 *   1. First, Routify 3 will look for a component suffixed with `.en-us.svelte` (e.g., `Home.en-us.svelte`).
 *   2. If the `.en-us` variant is not available, it will then try the `.en-uk` variant (e.g., `Home.en-uk.svelte`).
 *   3. If neither variant is available, Routify 3 will default to the base component (e.g., `Home.svelte`).
 *
 * This setup ensures that Routify 3 searches for the most specific variation first, falling back to more general
 * variations if the specific ones are not found, thereby providing a flexible and efficient way to manage route variations.
 *
 * This approach allows for flexible and organized management of route variations based on
 * language, theme, or other factors, enhancing the adaptability of your Routify application.
 *
 * @example
 * const routifyConfig = {
 *   plugins: [
 *     flexMapsPlugin({
 *       variationsMap: {
 *         default: ['en-us,en','en', 'de'],
 *         widget: ['en', 'de'],
 *      }
 *     })
 *   ],
 *   routesDir: {
 *     'default': 'src/routes',
 *     'widget': 'src/widget'
 *   },
 * }
 * @param {Partial<FlexMapPluginOptions>} options
 * @returns {RoutifyBuildtimePlugin[]}
 */
export const flexMapsPlugin = options => [
    flexMapsPluginInit(options),
    flexMapsNormalize(options),
]

/**
 * Creates a route dir for each variation in the `variationsMap` option.
 * Eg. if `variationsMap` is `{ 'default': ['en', 'de'] }`, the plugin will create
 * a `routes.default.en.js` and a `routes.default.de.js` file.
 * @params {Partial<FlexMapPluginOptions>} options
 * @returns {RoutifyBuildtimePlugin}
 */
function flexMapsPluginInit(options) {
    return {
        name: 'flexMapPlugin-createRouteDirs',
        before: 'filemapper',
        build: async ctx => {
            let { routesDir } = ctx.instance.options
            Object.entries(options.variationsMap).forEach(([routeDir, variations]) => {
                variations.forEach(variation => {
                    const variationRouteDir = `${routeDir}_${variation.split(',')[0]}`
                    routesDir[variationRouteDir] = routesDir[routeDir]
                })
            })
        },
    }
}

const missingBaseComponentWarning = (node, newName, ctx) => {
    const variant = node.file.path
    const base = newName + node.file.ext
    ctx.tools.log.warn(`Node "${variant}" does not have a corresponding "${base}" node.`)
}

/**
 *
 * @param {Partial<FlexMapPluginOptions>} options
 * @returns {RoutifyBuildtimePlugin}
 */
function flexMapsNormalize(options) {
    const allRootDirPreferences = createRootDirPreferences(options.variationsMap)

    return {
        name: 'flexMapPlugin-mergeVariantRoutes',
        after: 'metaFromFile',
        before: 'exporter',
        build: async ctx => {
            Object.entries(ctx.instance.rootNodes).forEach(([name, rootNode]) => {
                const rootDirPreferences = allRootDirPreferences[name]

                ;[...(rootDirPreferences?.priorities || [])]
                    .reverse()
                    .forEach(priority => {
                        rootNode.descendants.forEach(node => {
                            // if node.name ends with the current rootNode language
                            // remove the language from the name and remove the corresponding node

                            if (node.name.endsWith(`.${priority}`)) {
                                const newName = node.name.replace(`.${priority}`, '')
                                /** @type {RNodeBuildtime} */
                                let targetNode
                                try {
                                    if (newName === '_module') targetNode = node.parent
                                    else targetNode = node.parent.traverse(`./${newName}`)
                                } catch (e) {
                                    if (e.message.match('could not travel to'))
                                        missingBaseComponentWarning(node, newName, ctx)
                                }
                                Object.keys(node).forEach(key => {
                                    if (key !== 'name') targetNode[key] = node[key]
                                })
                                node.remove()
                            }
                        })
                    })
                // else if node.name ends with one of the other variations
                // remove the node
                rootNode.descendants.forEach(node => {
                    if (
                        rootDirPreferences?.unwanted.some(variation =>
                            node.name.endsWith(`.${variation}`),
                        )
                    ) {
                        node.parent.traverse(`./${node.name}`).remove()
                    }
                })
            })
        },
    }
}

/**
 *
 * @param {Object<string,string[]>} variationsMap
 */
function createRootDirPreferences(variationsMap) {
    /** @type {Object<string, {priorities: string[], unwanted: string[]}>} */
    const rootDirNameToPriorities = {}

    Object.entries(variationsMap).forEach(([_routeDir, variations]) => {
        const allVariations = variations.map(variation => variation.split(',')).flat()
        variations.forEach(variation => {
            const priorities = variation.split(',')
            const unwanted = allVariations.filter(
                variation => !priorities.includes(variation),
            )
            const routeDir = `${_routeDir}_${priorities[0]}`

            rootDirNameToPriorities[routeDir] = { priorities, unwanted }
        })
    })

    return rootDirNameToPriorities
}
