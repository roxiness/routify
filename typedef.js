/**
//  * @typedef {import("svelte/store").Readable<{component: RouteNode}>} ContextStore
 * @typedef {import("svelte").SvelteComponent} SvelteComponent
 */

/**
 * ClientNode
 * @typedef {Object.<string, *> & DefinedFile & ClientNodeSpecifics} ClientNode
 *
 * @typedef {Object} ClientNodeSpecifics
 * @prop {ClientNode[]} layouts
 * @prop {ClientNode|undefined} parent
 * @prop {ClientNode|undefined} nextSibling
 * @prop {ClientNode|undefined} prevSibling
 * @prop {ClientNode[]} lineage
 * @prop {String} ext
 * @prop {Meta} meta
 * @prop {String} id
 * @prop {String} path
 * @prop {String} shortPath
 * @prop {String} ranking
 * @prop {Boolean} isIndexable
 * @prop {Boolean} isNonIndexable
 * @prop {String[]} paramKeys
 * @prop {String} regex
 * @prop {function():SvelteComponent|Promise<SvelteComponent>} component
 * @prop {ClientNode} last
 * @prop {ClientNodeApi} api
 */

/**
 * ClientNodeApi
 * @typedef {Object} ClientNodeApi
 * @prop {ClientNodeApi|undefined} parent
 * @prop {ClientNodeApi|undefined} next
 * @prop {ClientNodeApi|undefined} prev
 * @prop {ClientNodeApi[]} children
 * @prop {Boolean} isMeta
 * @prop {String} path
 * @prop {String} title
 * @prop {Meta} meta
 * @prop {ClientNode} __file
 */

/**
 * File
 * @typedef {Object.<string, *> & MiscFile & GeneratedFile & DefinedFile} RouteNode
 *
 * @typedef {Object} DefinedFile
 * @prop {Boolean=} isFile
 * @prop {Boolean=} isDir
 * @prop {Boolean=} isPage
 * @prop {Boolean=} isLayout
 * @prop {Boolean=} isReset
 * @prop {Boolean=} isIndex
 * @prop {Boolean=} isFallback
 *
 * @typedef {Object} GeneratedFile
 * @prop {String} name
 * @prop {String} path
 * @prop {RouteNode[]=} dir
 * @prop {String} absolutePath
 * @prop {String} isFile
 * @prop {String} filepath
 * @prop {String} ext
 * @prop {Boolean} badExt
 *
 * @typedef {Object} MiscFile
 * @prop {String} id
 * @prop {GetParentFile} getParent
 * @prop {RouteNode} parent
 * @prop {Meta} meta
 *
 * @typedef {function():RouteNode} GetParentFile
 * @returns {RouteNode}
 */

/**
 * @typedef {Object} Meta
 * @prop {Boolean=} preload Bundle with main app
 * @prop {*=} precache-order
 * @prop {*=} precache-proximity
 * @prop {Boolean=} recursive
 * @prop {Boolean=} bundle Bundle folder recursively in a single .js file
 * @prop {String|Number|false=} index Position among siblings
 * @prop {String=} name Custom identifier
 * @prop {String=} title Title of the page
 * @prop {MetaChild[]} [children]
 * @prop {String} [$$bundleId]
 *
 * @typedef {Object} MetaChild
 * @prop {String} [title]
 * @prop {String} [path]
 * @prop {MetaChild[]} [children]
*/

/**
 * Tree Payload
 * @typedef {Object} TreePayload
 * @prop {RouteNode[]} routes
 * @prop {RouteNode} tree
 * @prop {BuildConfig} options
 * @prop {Object} metaParser
 * @prop {Object} defaultMeta
 */


/**
 * Build Config
 * @typedef {Object} BuildConfig
 * @prop {String=} pages
 * @prop {String=} routifyDir
 * @prop {Boolean=} dynamicImports
 * @prop {Boolean=} singleBuild
 * @prop {String=} distDir
 * @prop {(String|Array)=} extensions
 * @prop {(String|Array)=} ignore
 * @prop {Boolean=} noHashScroll
 */



/**
 * @typedef {Object.<string, *>} UrlParams
 * 
 * @typedef {Object} UrlOptions
 * @prop {Boolean=} strict
 */

/**
 * @typedef {Object} GotoOptions
 * @prop {Boolean=} strict preserve filename in url, ie. /index
 * @prop {Boolean} [redirect=false] use replaceState instead pushState
 * @prop {Boolean} [static=false] render url without redirecting
 * @prop {Boolean} [shallow=false] use the current layouts instead of those of the target
 */

/**
 * @typedef {UrlOptions} IsActiveOptions
 */

/**
 * @typedef {[ClientNodeApi, ClientNodeApi, ClientNodeApi]} ConcestorReturn
 */
