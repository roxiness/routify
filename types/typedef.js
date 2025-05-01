/**
 * COMMON
 * @typedef {import('../lib/common/RNode').RNode} RNode
 * @typedef {import('../lib/common/Routify').Routify} Routify
 * @typedef {{Node: RNode}} RoutifyBaseOptions
 * @typedef {typeof import('svelte/internal').SvelteComponentDev } SvelteComponentDev
 */
/**
 * @template T
 * @typedef {import('./utils').MaybeArray<T>} MaybeArray<T>
 */
/**
 * @template T
 * @typedef {import('./utils').MaybePromise<T>} MaybePromise<T>
 */

/**
 * RUNTIME
 * @typedef { HTMLElement | ((HTMLElement) => HTMLElement) | ((HTMLElement) => Promise<HTMLElement>) } scrollLock
 * @typedef {{instance: RoutifyRuntime}} RoutifyRuntimePayload
 * @typedef {import('../lib/runtime/Instance/RNodeRuntime').RNodeRuntime} RNodeRuntime
 * @typedef {import('../lib/runtime/Route/Route').Route} Route
 * @typedef {import('../lib/runtime/Router/Router').Router} Router
 * @typedef {import('../lib/runtime/Route/RouteFragment').RouteFragment} RouteFragment
 * @typedef {import('../lib/runtime/Instance/RoutifyRuntime').RoutifyRuntime} RoutifyRuntime
 * @typedef {RenderContext & {load: Partial<RoutifyLoadReturn>, route:Route}} DEPRECATED_RoutifyContext
 * @typedef {RenderContext} RoutifyContext
 * @typedef {import('../lib/runtime/renderer/RenderContext').RenderContext} RenderContext
 * @typedef {import('../lib/runtime/renderer/RenderContext').RouterContext} RouterContext
 * @typedef {import('../lib/runtime/decorators/AnchorDecorator').Location} AnchorLocation
 * @typedef {import('../lib/runtime/plugins/scroller/ScrollContext').ScrollContext} ScrollContext
 * @typedef {import('../lib/runtime/Router/urlReflectors/ReflectorBase.js')['BaseReflector']} BaseReflector
 *
 *  BUILDTIME
 * @typedef {import('../lib/buildtime/plugins/filemapper/lib/File').File} RFile
 * @typedef {import('../lib/buildtime/RoutifyBuildtime').RoutifyBuildtime} RoutifyBuildtime
 * @typedef {import('../lib/buildtime/RNodeBuildtime').RNodeBuildtime} RNodeBuildtime
 * @typedef {{instance: RoutifyBuildtime, tools: any}} RoutifyBuildtimePayload // todo tools should not be any
 * @typedef {import('../lib/buildtime/plugins/themes/utils.js').ThemeUserConfig} ThemeConfig
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
 * @prop {string} mainEntryPoint defaults to 'src/main.js'
 * @prop {string} rootComponent defaults to 'src/App.svelte'
 * @prop {string|Object<string,string>} routesDir defaults to { default: 'src/routes' }
 * @prop {string[]|boolean} ignoreMetaConflictWarnings
 * @prop {object} filemapper
 * @prop {1|2|3|4|5} logLevel defaults to 3
 * @prop {string[]} filemapper.moduleFiles defaults to ['_module.svelte', '_reset.svelte']
 * @prop {string[]} filemapper.resetFiles defaults to ['_reset.svelte']
 * @prop {string[]} filemapper.fallbackFiles defaults to ['_reset.svelte']
 * @prop {(string|RegExp)[]} extensions defaults to ['.svelte', '.html', '.md', '.svx'],
 * @prop {Object} sitemap
 * @prop {(nodes: RNodeBuildtime[]) => string=} sitemap.generate
 * @prop {string[]|Object[]} plugins
 * @prop {4|5} svelteApi defaults to 4
 * @prop {boolean} watch rebuild Routify routes on changes
 * @prop {ThemeConfig} themes
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
 * @prop { BaseReflector | [BaseReflector, any] } urlReflector where to store the URL state - browser by default
 * @prop { string= } url initial url - "/" by default
 * @prop { Boolean| Router } passthrough ignore clicks
 * @prop { MaybeArray<RouterInitCallback> } beforeRouterInit hook: runs before each router initiation
 * @prop { MaybeArray<RouterInitCallback> } afterRouterInit hook: runs after each router initiation
 * @prop { MaybeArray<BeforeUrlChangeCallback> } beforeUrlChange hook: guard that runs before url changes
 * @prop { MaybeArray<AfterUrlChangeCallback> } afterUrlChange hook: runs after url has changed
 * @prop { MaybeArray<AfterRouteRenderedCallback> } afterRouteRendered hook: runs after a new route has been rendered
 * @prop { MaybeArray<TransformFragmentsCallback> } transformFragments hook: transform route fragments after navigation
 * @prop { MaybeArray<OnMountRouterCallback> } onMount hook: runs when the router is mounted
 * @prop { MaybeArray<OnDestroyRouterCallback> } onDestroy hook: runs before router is destroyed
 * @prop { 'always' | 'never' | 'preserve' | 'contextual' } trailingSlash how to handle trailing slashes, defaults to 'never'
 * @prop { QueryHandler } queryHandler
 * @prop { Partial<RoutifyRuntimeOptions>[] } plugins
 * @prop { ClickHandler } clickHandler
 * @prop { AnchorLocation } anchor where to place the anchor element
 */

// /******************
//  * RENDER CONTEXT *
//  ******************/
// /**
//  * @typedef {Object} RenderContext
//  * @prop {AnchorLocation} anchorLocation
//  * @prop {import('svelte/store').Writable<RouteFragment[]>} childFragments
//  * @prop {RNodeRuntime}  node
//  * @prop {Object<string, any>} options
//  * @prop {RouteFragment} fragment
//  * @prop {import('svelte/store').Writable<boolean>} isActive
//  * @prop {import('svelte/store').Writable<boolean>} isVisible
//  * @prop {Boolean} wasVisible
//  * @prop {boolean} isInline
//  * @prop {import('svelte/store').Writable<{ parent: HTMLElement, anchor: HTMLElement }>} elem
//  * @prop {import('../lib/runtime/Route/Route').Route} route
//  * @prop {import('../lib/runtime/Router/Router').Router} router
//  * @prop {RenderContext} parentContext
//  * @prop {Decorator[]} decorators
//  * @prop {import('hookar').CollectionSyncVoid<any> | import('hookar').CollectionAsyncVoid<any>} [onDestroy]
//  * @prop {scrollBoundary} scrollBoundary
//  * @prop {DeferredPromise<void>} mounted
//  * @prop {Inline} inline *
//  */

/**
 * @template T {Object<string|number|symbol, any>}
 * @typedef {(Partial<Decorator<T>> & {component: SvelteComponentDev}) | SvelteComponentDev} DecoratorInput
 */

/**
 * @template T {Object<string|number|symbol, any>}
 * @typedef {Object} Decorator
 * @prop {boolean=} recursive
 * @prop {(payload: DecoratorShouldRenderPayload<T>)=>boolean=} shouldRender
 * @prop {SvelteComponentDev} component
 * @prop {number} order
 * @prop {T} props
 */

/**
 * @template T {Object<string|number|symbol, any>}
 * @typedef {Object} DecoratorShouldRenderPayload
 * @prop { RenderContext } context
 * @prop { boolean } root,
 * @prop { Decorator<T> } decorators
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
 * @typedef { function({route:Route}):void } AfterRouteRenderedCallback
 * @typedef { function(HTMLAnchorElement): any } OnUrlClickCallback
 * @typedef { function(RouteFragment[]):RouteFragment[] } TransformFragmentsCallback
 * @typedef { function({router: Router, context: {decorators: any[]}}):void } OnMountRouterCallback
 * @typedef { function({router: Router}):void } OnDestroyRouterCallback
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
 * @typedef {RoutifyLoadAsync | RoutifyLoadSync} RoutifyLoad
 *
 * @callback RoutifyLoadSync
 * @param {RoutifyLoadContext} context
 * @returns {Partial<RoutifyLoadReturn>|null}
 *
 * @callback RoutifyLoadAsync
 * @param {RoutifyLoadContext} context
 * @returns {Promise<Partial<RoutifyLoadReturn>|null>}
 *
 *
 * @typedef {object} RoutifyLoadContext
 * @prop {Route} route
 * @prop {import('../lib/runtime').UrlFromString} url
 * @prop {Route=} prevRoute
 * @prop {Boolean} isNew
 * @prop {fetch} fetch
 * @prop {RouteFragment} fragment
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
 * @prop {string[]} reservedMetaKeys
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
 * @prop {MetaContextSplit} split dynamically import the value
 * @prop {import('persistable')['default']['call']} persist persist the return of a callback on disk. Return persisted data on subsequent calls
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
 * CLICK HANDLER *
 *****************/

/**
 * @typedef {object} ClickHandler
 * @prop {(event:MouseEvent|KeyboardEvent, url:string)=>string|false =} callback
 * @prop {HTMLElement|((elem: HTMLElement)=>HTMLElement) =} elem
 */

/*****************
 * COMPONENT     *
 *****************/
/**
 * @callback ComponentGuardFn
 * @param {Route} route
 */

/**
 * @typedef ReservedCmpProps
 * @prop {ComponentGuardFn=} guard
 * @prop {RoutifyLoad=} load
 * @prop {SvelteComponentDev=} default
 */

/** @typedef {ReservedCmpProps & Object.<string, any>} Module */

/** @typedef {()=>(Promise<ReservedCmpProps>)} LoadSvelteModule */

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

/**
 * @typedef { import('svelte').SvelteComponentTyped } SvelteComponentTyped
 *
 * @typedef { Partial<Inline> | boolean } InlineInput
 *
 * @typedef { object } Inline
 * @prop { (node: RNodeRuntime, context: RenderContext)=>boolean } isInline return true to inline the child node
 * @prop { InlineCallback<boolean> } shouldScroll return true to inline the child node
 * @prop { 'browser'|'ssr'|'always' } context
 * @prop { (elem: HTMLElement, instant: boolean, options: any) => void } scrollIntoView
 * @prop { Object<string, string[]> } params
 * @prop { SvelteComponentDev? } wrapper
 */

/**
 * @template T
 * @typedef {Promise<T> & {resolve: (T)=>void, reject: (T)=>void}} DeferredPromise
 */

/**
 * @template T
 * @callback InlineCallback
 * @param {ScrollContext} context
 * @param {number} index
 * @param {ScrollContext[]} allScrollContexts
 * @param {InlineCallback<T>} [defaultCb]
 * @returns {T}
 */

// /**
//  * @template T
//  * @callback InitialInlineCallback
//  * @param {ScrollContext} context
//  * @param {number} index
//  * @param {ScrollContext[]} allScrollContexts
//  * @param {InlineCallback<T>} [defaultCb]
//  * @returns {T}
//  */

/** @typedef {Partial<{inline: InlineInput, decorator:DecoratorInput<any>, props, options, anchor: AnchorLocation, scrollLock: scrollLock}>} RenderContextOptions*/

/**
 * @typedef {Object} TraverseOptions
 * @property {boolean} [allowDynamic=true] allow traversing dynamic components (parameterized)
 * @property {boolean} [includeIndex=true] include index components in the chain
 * @property {boolean} [navigableChildrenOnly=false] only traverse children that are not marked as noRoute
 * @property {boolean|'report'} [silent=false] false: throw errors for 404s, true: don't throw errors for 404s, 'report': log errors for 404s
 * @property {RNode} [rootNode] the root node to start traversing from
 */
