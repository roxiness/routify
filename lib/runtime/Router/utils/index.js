/**
 * @typedef { Object } RouterOptionsNormalizedOverlay
 * @prop { UrlRewrite[] } urlRewrite hook: transforms paths to and from router and browser
 * @prop { RouterInitCallback[] } beforeRouterInit hook: runs before each router initiation
 * @prop { RouterInitCallback[] } afterRouterInit hook: runs after each router initiation
 * @prop { BeforeUrlChangeCallback[] } beforeUrlChange hook: guard that runs before url changes
 * @prop { AfterUrlChangeCallback[] } afterUrlChange hook: runs after url has changed
 * @prop { TransformFragmentsCallback[] } transformFragments hook: transform route fragments after navigation
 * @prop { OnDestroyRouterCallback[] } onDestroy hook: runs before router is destroyed
 */

/**
 * @typedef { RoutifyRuntimeOptions & RouterOptionsNormalizedOverlay } RouterOptionsNormalized
 */

/**
 * merges options.plugin into options
 * @param {Partial<RoutifyRuntimeOptions>} options
 * @param {Partial<RouterOptionsNormalized>=} config
 */
export const normalizeRouterOptions = (options, config) => {
    config = config || {
        name: '',
        beforeRouterInit: [],
        afterRouterInit: [],
        urlRewrite: [],
        beforeUrlChange: [],
        afterUrlChange: [],
        transformFragments: [],
        onDestroy: [],
    }

    // separate plugins and options
    const { plugins, ...optionsOnly } = options

    /** @type {Partial<RoutifyRuntimeOptions>[]} */
    const optionsGroups = [...(plugins || []), optionsOnly]
    optionsGroups.forEach(pluginOptions => {
        pluginOptions.plugins?.forEach(plugin => normalizeRouterOptions(plugin, config))
        delete pluginOptions.plugins

        Object.entries(pluginOptions).forEach(([field, value]) => {
            if (Array.isArray(config[field]))
                config[field].push(...[value].flat().filter(Boolean))
            else config[field] = value || config[field]
        })
    })
    return config
}
