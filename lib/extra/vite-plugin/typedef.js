/**
 * @typedef {Object} VitePluginSpecificOptionsRenderInput
 * @prop {Partial<VitePluginOptions_SSR>|boolean} ssr Server Side Rendering - prerender pages on the server
 * @prop {Partial<VitePluginOptions_SSG>|boolean} ssg Static Site Generation - prerender pages at build time
 * @prop {Partial<VitePluginOptions_CSR>|boolean} csr Client Side Rendering - render pages in the client browser, also known as SPA
 */

/**
 * @typedef {Object} VitePluginSpecificOptionsRender
 * @prop {VitePluginOptions_SSR} ssr Server Side Rendering - prerender pages on the server
 * @prop {VitePluginOptions_SSG} ssg Static Site Generation - prerender pages at build time
 * @prop {VitePluginOptions_CSR} csr Client Side Rendering - render pages in the client browser, also known as SPA
 */

/**
 * @typedef {Object} VitePluginSpecificOptions
 * @prop {Boolean} run Run Routify
 * @prop {Boolean} forceLogging Force logging in production
 * @prop {VitePluginSpecificOptionsRender} render
 * @prop {string} outDir
 */

/**
 * @typedef {Object} VitePluginSpecificOptionsInput
 * @prop {Boolean} run Run Routify
 * @prop {Boolean} forceLogging Force logging in production
 * @prop {Partial<VitePluginSpecificOptionsRenderInput>} render
 */

/**
 * @typedef {Object} VitePluginOptions_SSG
 * @prop {Boolean} enable
 * @prop {any} spank Options to use with spank when prerendering
 */

/**
 * @typedef {Object} VitePluginOptions_SSR
 * @prop {boolean} enable enable ssr in dev
 * @prop {"cjs"|"esm"} type
 */

/**
 * @typedef {Object} VitePluginOptions_CSR
 * @prop {boolean} enable
 */

/**
 * @typedef {RoutifyBuildtimeOptions & VitePluginSpecificOptions} VitePluginOptions
 * @typedef {RoutifyBuildtimeOptions & VitePluginSpecificOptionsInput} VitePluginOptionsInput
 */
