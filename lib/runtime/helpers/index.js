import { derived } from 'svelte/store'
import { pathAndParamsToUrl, contexts, populateUrl } from '../utils/index.js'
import { get } from 'svelte/store'

/**
 * gets most recent common ancestor
 * @param {RNode} node1
 * @param {RNode} node2
 */
export const getMRCA = (node1, node2) => {
    const lineage1 = [node1, ...node1.ancestors]
    const lineage2 = [node2, ...node2.ancestors]
    return lineage1.find(node => lineage2.includes(node))
}

export const getPath = (node1, node2) => {
    const lineage1 = [node1, ...node1.ancestors]
    const lineage2 = [node2, ...node2.ancestors]
    const mrca = getMRCA(node1, node2)
    const backtrackSteps = lineage1.indexOf(mrca)
    const backtrackStr = backtrackSteps ? '../'.repeat(backtrackSteps) : ''
    const forwardSteps = lineage2.indexOf(mrca)
    const forwardStepsStr = lineage2
        .slice(0, forwardSteps)
        .reverse()
        .map(n => n.name)
        .join('/')
    return backtrackStr + forwardStepsStr
}

/**
 * @callback Goto
 * @param {string} path relative, absolute or named URL
 * @param {Object.<string, string>=} userParams
 * @param {any=} options
 * @type {Readable<Goto>} */
export const goto = {
    subscribe: (run, invalidate) => {
        const { router } = contexts
        return derived(url, $url => (path, userParams, options) => {
            const newUrl = $url(path, userParams)
            router.url.push(newUrl)
        }).subscribe(run, invalidate)
    },
}

/**
 * @template T
 * @typedef {import('svelte/store').Readable<T>} Readable
 */

/**
 * @typedef {Object} IsActiveOptions
 * @prop {Boolean} [recursive=true] return true if descendant is active
 */

/**
 * @callback Url
 * @param {string} inputPath
 * @param {Object.<string, string>=} userParams
 * @returns {string}
 *
 * @type {Readable<Url>}
 **/
export const url = {
    subscribe: (run, invalidate) => {
        const { router } = contexts
        const originalOriginNode = contexts.fragment.node
        return derived(router.activeRoute, activeRoute => {
            // in case we swapped the routes tree (rootNode), make sure we find
            // the node that corresponds with the previous origin
            // otherwise mrca will break as there's no shared ancestor
            const originNode = router.rootNode.traverse(originalOriginNode.path)
            return (inputPath, userParams = {}) => {
                // we want absolute urls to be relative to the nearest router. Ironic huh
                const offset = inputPath.startsWith('/') ? router.rootNode.path : ''
                const targetNode = originNode.traverse(offset + inputPath)
                if (!targetNode) {
                    console.error('could not find destination node', inputPath)
                    return
                }
                const mrca = getMRCA(targetNode, router.rootNode)
                const path = '/' + getPath(mrca, targetNode)

                const params = {
                    ...inheritedParams(targetNode, activeRoute),
                    ...userParams,
                }

                const internalUrl = populateUrl(path, params, activeRoute)
                return router.getExternalUrl(internalUrl)
            }
        }).subscribe(run, invalidate)
    },
}

/**
 *
 * @param {RNode} node
 * @param {Route} route
 */
const inheritedParams = (node, route) => {
    const lineage = [node, ...node.ancestors].reverse()
    const params = lineage.map(
        _node =>
            route.allFragments.find(
                // compare both path and node
                // node could have moved /shop/[product], eg: to /en/shop/[product]
                // but could also have been replaced by a different, but matching node
                // if the route tree changed, eg: /en/shop/[product] /da/shop/[product]
                fragment => fragment.node === _node || fragment.node.path === _node.path,
            )?.params,
    )
    return Object.assign({}, ...params)
}

/**
 * @type {Readable<Object.<string, any>>}
 */
export const params = {
    subscribe: (run, invalidate) =>
        derived(contexts.router.params, params => params).subscribe(run, invalidate),
}

/**
 * @callback IsActive
 * @param {String=} path
 * @param {Object.<string,string>} [params]
 * @param {IsActiveOptions} [options]
 * @returns {Boolean}
 *
 * @type {Readable<IsActive>} */
export const isActive = {
    subscribe: (run, invalidate) =>
        derived(contexts.router.activeRoute, isActiveRoute).subscribe(run, invalidate),
}

export const isActiveRoute = $route => isActiveUrl($route.url)

export const isActiveUrl =
    url =>
    /** @type {IsActive} */
    (path, params, options = {}) => {
        const { recursive } = { recursive: true, ...options }
        path = pathAndParamsToUrl(path, params, x => '')
        if (recursive) path = path.replace(/\/index\/?$/, '')

        // ensure uniform string endings to prevent /foo matching /foobar
        return (url + '/').startsWith(path + '/')
    }

/**
 * @param {string} path
 */
export const resolveNode = path => {
    const { node } = contexts.fragment
    return path.startsWith('/')
        ? resolveAbsoluteNode(node, path)
        : path.startsWith('.')
        ? traverseNode(node, path)
        : resolveNamedNode(node, path)
}

// todo
export const resolveAbsoluteNode = (node, path) => {}

/**
 *
 * @param {RNodeRuntime} node
 * @param {string} path
 * @returns {RNodeRuntime}
 */
export const traverseNode = (node, path) => node.traverse(path)

// todo
export const resolveNamedNode = (node, name) => {}

/**
 * @template {Function} T
 * @template U
 * @param {T} callback
 * @returns {Readable<T extends () => infer U ? U : any>}
 */
const pseudoStore = callback => ({
    subscribe: run => {
        run(callback())
        return () => {}
    },
})

export const context = pseudoStore(() => contexts.fragment)

export const node = pseudoStore(() => get(context).node)

export const meta = pseudoStore(() => get(node).meta)

/** @type {Readable<Route>} */
export const activeRoute = {
    subscribe: run => contexts.router.activeRoute.subscribe(run),
}

/** @type {Readable<Route>} */
export const pendingRoute = {
    subscribe: run => contexts.router.pendingRoute.subscribe(run),
}

/**@type {Readable<function(AfterUrlChangeCallback):any>} */
export const afterUrlChange = {
    subscribe: run => {
        const hookHandles = []
        /**
         * @param {AfterUrlChangeCallback} callback
         */
        const register = callback => {
            const unhook = contexts.router.afterUrlChange(callback)
            hookHandles.push(unhook)
            return unhook
        }
        run(register)
        return () => hookHandles.map(unhook => unhook())
    },
}

/**@type {Readable<function(BeforeUrlChangeCallback):any>} */
export const beforeUrlChange = {
    subscribe: run => {
        const hookHandles = []
        /**
         * @param {BeforeUrlChangeCallback} callback
         */
        const register = callback => {
            const unhook = contexts.router.beforeUrlChange(callback)
            hookHandles.push(unhook)
            return unhook
        }
        run(register)
        return () => hookHandles.map(unhook => unhook())
    },
}
