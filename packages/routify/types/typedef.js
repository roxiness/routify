/**
 * COMMON
 * @typedef {import('../lib/common/RNode').RNode} RNode
 * @typedef {import('../lib/common/Routify').Routify} Routify
 *
 * @typedef {{Node: RNode}} RoutifyBaseOptions
 *
 * RUNTIME
 * @typedef {{instance: RoutifyRuntime}} RoutifyRuntimePayload
 * @typedef {import('../lib/runtime/Instance/RNodeRuntime').RNodeRuntime} RNodeRuntime
 * @typedef {import('../lib/runtime/route/Route').Route} Route
 * @typedef {import('../lib/runtime/Router/Router').Router} Router
 * @typedef {import('../lib/runtime/route/RouteFragment').RouteFragment} RouteFragment
 * @typedef {import('../lib/runtime/Instance/RoutifyRuntime').RoutifyRuntime} RoutifyRuntime
 *
 *  BUILDTIME
 * @typedef {import('../lib/buildtime/plugins/filemapper/lib/File').File} RFile
 * @typedef {import('../lib/buildtime/RoutifyBuildtime').RoutifyBuildtime} RoutifyBuildtime
 * @typedef {import('../lib/buildtime/RNodeBuildtime').RNodeBuildtime} RNodeBuildtime
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
 * @prop {string[]} filemapper.fallbackFiles defaults to ['_reset.svelte']
 * @prop {string|Object<string,string>} routesDir defaults to { default: 'src/routes' }
 * @prop {(string|RegExp)[]} extensions defaults to ['.svelte', '.html', '.md', '.svx'],
 * @prop {string[]|Object[]} plugins
 * @prop {boolean} watch rebuild Routify routes on changes
 */

/*******************
 * RUNTIME OPTIONS *
 *******************/
/**
 * @typedef { Object } RoutifyRuntimeOptions
 * @prop { RoutifyRuntime } instance instance to use. Uses global by default
 * @prop { RNodeRuntime } rootNode
 * @prop { any } routes the routes tree
 * @prop { string } name name of router - leave blank if only only one router is used
 * @prop { UrlRewrite|UrlRewrite[] } urlRewrite hook: transforms paths to and from router and browser
 * @prop { import('../lib/runtime/Router/urlReflectors/ReflectorBase.js')['BaseReflector'] } urlReflector where to store the URL state - browser by default
 * @prop { string= } url initial url - "/" by default
 * @prop { Boolean| Router } passthrough ignore clicks
 * @prop { MaybeArray<RouterInitCallback> } beforeRouterInit hook: runs before each router initiation
 * @prop { MaybeArray<RouterInitCallback> } afterRouterInit hook: runs after each router initiation
 * @prop { MaybeArray<BeforeUrlChangeCallback> } beforeUrlChange hook: guard that runs before url changes
 * @prop { MaybeArray<AfterUrlChangeCallback> } afterUrlChange hook: runs after url has changed
 * @prop { MaybeArray<TransformFragmentsCallback> } transformFragments hook: transform route fragments after navigation
 * @prop { MaybeArray<OnDestroyRouterCallback> } onDestroy hook: runs before router is destroyed
 * @prop { QueryHandler } queryHandler
 * @prop { Partial<RoutifyRuntimeOptions>[] } plugins
 */

/**
 * @template T
 * @typedef { import('svelte/store').Readable } Readable<T>
 */

/**
 * @typedef { import('../lib/runtime/utils/index.js').Getable<Route> } RouteStore
 */

/**
 * @typedef { function({router: Router, firstInit: Boolean}): any } RouterInitCallback
 * @typedef { function({route: Route}): any } BeforeUrlChangeCallback
 * @typedef { function({
 *   route: Route,
 *   history: Route[]
 * }): any } AfterUrlChangeCallback
 * @typedef { function(RouteFragment[]):RouteFragment[] } TransformFragmentsCallback
 * @typedef { function({router: typeof this}):void } OnDestroyRouterCallback
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

/********************************
 * ROUTIFY LOAD CONTEXT *
 ********************************/
/**
 * @callback RoutifyLoad
 * @param {RoutifyLoadContext} context
 * @returns {MaybePromise<Partial<RoutifyLoadReturn>|null>}
 *
 *
 * @typedef {object} RoutifyLoadContext
 * @prop {Route} route
 * @prop {RNodeRuntime} node
 *
 * @typedef {object} RoutifyLoadReturn
 * @prop {number} status
 * @prop {string|Error} error
 * @prop {string} redirect
 * @prop {number} maxage
 * @prop {object} props
 */

/**********
 * PLUGIN *
 **********/

/**
 * @typedef {object} RoutifyBuildtimeRuntimePlugin
 * @prop {string} path example: '@roxi/routify/plugins/reset'
 * @prop {string} importee the imported name from the path, defaults to "default"
 * @prop {object} options options passed to the runtime plugin
 */

/**
 * @typedef {Partial<RoutifyRuntimeOptions>} RoutifyRuntimePlugin
 * @typedef {Partial<RoutifyBasePlugin & RoutifyBuildtimePluginType>} RoutifyBuildtimePlugin
 */

/**
 * @typedef {Object} RoutifyBasePlugin
 * @prop {string=} name name of plugin
 * @prop {string|string[]=} before name of plugin(s) to run before
 * @prop {string|string[]=} after name of plugin(s) to run after
 * @prop {function(Partial<RoutifyBuildtimeOptions>):Partial<RoutifyBuildtimeOptions>} options runs before "build"
 */

/**
 * @typedef {Object} RoutifyBuildtimePluginType
 * @prop {function(RoutifyBuildtimePayload):(Promise<any>|any)=} build runs after "options"
 * @prop {string=} path
 * @prop {RoutifyExternalMetaHelper=} meta
 * @prop {(context:MetaContext & Object.<string,any>)=>MetaContext} [metaContext] provides context to *.meta.js files
 * @prop {(id:string, content:string, instance: RoutifyBuildtime) => string} [transform] transform output files
 * @prop {RoutifyBuildtimeRuntimePlugin[]} runtimePlugins
 */

/**
 * @callback MetaContextSplit
 * @param {any} value the value to be split
 * @param {string=} name defaults to hashed value
 */

/**
 * Modify the context available to meta files
 * @typedef {Object} MetaContext
 * @prop {RoutifyBuildtime} instance
 * @prop {RNodeBuildtime} node
 * @prop {Partial<RoutifyBuildtimeOptions>} options
 * @prop {MetaContextSplit=} split dynamically import the value
 * @prop {import('persistable')['default']['call']=} persist persist the return of a callback on disk. Return persisted data on subsequent calls
 * @prop {string} tempPath temporary path for the respective file, eg. ./.routify/cached/src/routes/index.svelte/
 */

/*****************
 * URL REWRITE *
 *****************/

/**
 * @callback UrlRewriteFn
 * @param {string} url
 * @param {{router: Router}} ctx
 * @returns {string}
 */

/**
 * @typedef {Object} UrlRewrite
 * @prop {UrlRewriteFn} toInternal
 * @prop {UrlRewriteFn} toExternal
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
 * @param {Route} route
 * @return {Object<string, string>}
 */

/**
 * @callback QueryHandlerStringify
 * @param {Object<string, string>} search
 * @param {Route} route
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
 * @typedef RerservedCmpProps
 * @prop {ComponentGuardFn=} guard
 * @prop {RoutifyLoad=} load
 * @prop {import('svelte/types/runtime').SvelteComponent=} default
 */

/** @typedef {RerservedCmpProps & Object.<string, any>} Module */

/** @typedef {()=>RerservedCmpProps} LoadSvelteModule */

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
