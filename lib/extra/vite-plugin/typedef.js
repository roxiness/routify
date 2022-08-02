/**
 * @typedef {Object} VitePluginSpecificOptions
 * @prop {Boolean} run Run Routify
 * @prop {Boolean} forceLogging Force logging in production
 * @prop {Partial<VitePluginOptions_SSR>} ssr SSR options
 */

/**
 * @typedef {Object} VitePluginOptions_SSR
 * @prop {boolean} enable enable ssr in dev
 * @prop {"cjs"|"esm"} type
 * @prop {boolean=} [prerender=true] Prerender pages into dist/client
 * @prop {any} spank Options to use with spank when prerendering
 */

/**
 * @typedef {RoutifyBuildtimeOptions & VitePluginSpecificOptions} VitePluginOptions
 */
