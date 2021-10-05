/**
 * COMMON
 * @typedef {import('./lib/common/RNode').RNode} RNode
 * @typedef {import('./lib/common/Routify').Routify} Routify
 *
 * @typedef {{Node: RNode}} RoutifyBaseOptions
 *
 * RUNTIME
 * @typedef {{instance: RoutifyRuntime}} RoutifyRuntimePayload
 * @typedef {import('./lib/runtime/Instance/RNodeRuntime').RNodeRuntime} RNodeRuntime
 * @typedef {import('./lib/runtime/route/Route').Route} Route
 * @typedef {import('./lib/runtime/Router/Router').Router} Router
 * @typedef {import('./lib/runtime/route/RouteFragment').RouteFragment} RouteFragment
 * @typedef {import('./lib/runtime/Instance/RoutifyRuntime').RoutifyRuntime} RoutifyRuntime
 *
 *  BUILDTIME
 * @typedef {import('./lib/buildtime/plugins/filemapper/lib/File').File} RFile
 * @typedef {import('./lib/buildtime/RoutifyBuildtime').RoutifyBuildtime} RoutifyBuildtime
 * @typedef {import('./lib/buildtime/RNodeBuildtime').RNodeBuildtime} RNodeBuildtime
 * @typedef {{instance: RoutifyBuildtime, tools: any}} RoutifyBuildtimePayload // todo tools should not be any
 *
 */

/**
 * @template T
 * @callback RoutifyCallback
 * @param {{instance: Routify}} first
 * @returns {T|Promise<T>}
 */

/*********************
 * BUILDTIME OPTIONS *
 *********************/

/**
 * @typedef {Object} RoutifyBuildtimeOptions
 * @prop {RNodeBuildtime} Node
 * @prop {string} routifyDir defaults to '.routify'
 * @prop {boolean} clearRoutifyDir
 * @prop {object} filemapper
 * @prop {string[]} filemapper.moduleFiles defaults to ['_module.svelte', '_reset.svelte']
 * @prop {string[]} filemapper.resetFiles defaults to ['_reset.svelte']
 * @prop {string|Object<string,string>} routesDir defaults to { default: 'src/routes' }
 * @prop {string[]} extensions defaults to ['.svelte', '.html', '.md', '.svx'],
 * @prop {string[]|Object[]} plugins
 * @prop {boolean} watch rebuild Routify routes on changes
 */

/*******************
 * RUNTIME OPTIONS *
 *******************/
/**
 * @typedef {Object} RoutifyRuntimeOptions
 * @prop {function(RoutifyRuntime):void} init
 * @prop {UrlTransform|UrlTransform[]} urlTransform
 * @prop {QueryHandler|QueryHandler[]} queryHandler
 * @prop {function} beforeRouteChange
 * @prop {function} afterRouteChange
 */

/********************************
 * ROUTIFY EXTERNAL META HELPER *
 ********************************/
/**
 * @typedef {Object} RoutifyExternalMetaHelper
 * @prop {RoutifyRuntime} instance
 * @prop {any} options //todo
 * @prop {string} tempPath
 */

/**********
 * PLUGIN *
 **********/

/**
 * @typedef {RoutifyBasePlugin & RoutifyRuntimeOptions} RoutifyRuntimePlugin
 * @typedef {RoutifyBasePlugin & RoutifyBuildtimePluginType} RoutifyBuildtimePlugin
 */

/**
 * @typedef {Object} RoutifyBasePlugin
 * @prop {string=} name name of plugin
 * @prop {string|string[]=} before name of plugin(s) to run before
 * @prop {string|string[]=} after name of plugin(s) to run after
 */

/**
 * @typedef {Object} RoutifyBuildtimePluginType
 * @prop {function(RoutifyBuildtimePayload):(Promise<any>|any)=} build
 * @prop {string=} path
 * @prop {RoutifyExternalMetaHelper=} meta
 * @prop {(context:MetaContext & Object.<string,any>)=>MetaContext} [metaContext]
 * @prop {(RoutifyBuildtimePayload)=>Boolean=} condition
 */

/**
 * @callback
 */

/**
 * Modify the context available to meta files
 * @typedef {Object} MetaContext
 * @prop {RoutifyBuildtime} instance
 * @prop {RNodeBuildtime} node
 * @prop {RoutifyBuildtimeOptions} options
 * @prop {(value:any, name?: string)=>{}} split
 * @prop {string} tempPath
 */

/*****************
 * URL TRANSFORM *
 *****************/

/**
 * @callback UrlTransformFn
 * @param {string} url
 * @returns {string}
 */

/**
 * @typedef {Object} UrlTransform
 * @prop {UrlTransformFn} toInternal
 * @prop {UrlTransformFn} toExgternal
 */

/*****************
 * QUERY HANDLER *
 *****************/

/**
 * @typedef {Object} QueryHandler
 * @prop {QueryHandlerParse} parse
 * @prop {QueryHandlerStringify} stringify
 */

/**
 * @callback QueryHandlerParse
 * @param {string} search
 * @return {Object<string, string>}
 */

/**
 * @callback QueryHandlerStringify
 * @param {Object<string, string>} search
 * @return {string}
 */

/*****************
 * COMPONENT     *
 *****************/
/**
 * @callback ComponentGuardFn
 * @param {Route} route
 */

/**
 * @callback ComponentPreloadFn
 */

/**
 * @typedef RerservedCmpProps
 * @prop {ComponentGuardFn=} guard
 * @prop {ComponentPreloadFn=} preload
 */

/** @typedef {RerservedCmpProps & Object.<string, any>} Module */

/** @typedef {any} MixedModule */

/*****************
 * MISC          *
 *****************/

/**
 * @typedef {Object} PathNode
 * @prop {string} urlFragment
 * @prop {RNodeRuntime} node
 */

/** @typedef  {'pushState'|'replaceState'|'popState'} UrlState  */

/**
 * @typedef {Object} FragmentContext
 * @prop {Route} route
 * @prop {RNodeRuntime} node
 * @prop {function=} load preload functionality for pages and modules
 * @prop {Object.<string,any>} localParams
 */

/**
 * @typedef {Object} NodeTreeExport
 * @prop {string} id
 * @prop {string=} name
 * @prop {any} module
 * @prop {string=} rootName
 * @prop {any=} file
 * @prop {NodeTreeExport[]} children
 */

// todo is routifyDir needed in generated routes files?

/**
 * @typedef {Object} BrowserAdapter
 * @prop {(browserUrl: string, router: Router)=>string} toRouter Called by each router when the browser URL changes. Returns an internal URL for each respective router.
 * @prop {(routers: Router[])=>string} toBrowser compiles all router URLS into a single URL for the browser.
 */
