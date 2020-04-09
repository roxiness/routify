
/**
 * File
 * @typedef {Object.<string, *> & MiscFile & GeneratedFile & DefinedFile} RouteNode
 *
 * @typedef {Object} DefinedFile
 * @prop {Boolean=} isLayout
 * @prop {Boolean=} isReset
 * @prop {Boolean=} isIndex
 * @prop {Boolean=} isFallback
 * @prop {Boolean=} hasParam
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
 * @prop {*=} preload
 * @prop {*=} precache-order
 * @prop {*=} precache-proximity
 * @prop {*=} recursive
 * @prop {*=} bundle
 * @prop {*=} index
 * @prop {Array=} children
 * @prop {String=} $$bundleId
*/

/**
 * Tree Payload
 * @typedef {Object} TreePayload
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