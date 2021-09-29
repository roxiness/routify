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
 * @param {Object.<string, string>} userParams
 * @returns {string}
 *
 * @type {Readable<Url>}
 **/
export const url = {
    subscribe: (run, invalidate) => {
        const { router } = contexts
        const originNode = contexts.fragment.node
        return derived(router.params, prevParams => {
            return (inputPath, userParams) => {
                const params = { ...(prevParams || {}), ...(userParams || {}) }
                const targetNode = traverseNode(originNode, inputPath)
                const mrca = getMRCA(targetNode, router.rootNode)
                const path = '/' + getPath(mrca, targetNode)
                return populateUrl(path, params, router.queryHandler)
            }
        }).subscribe(run, invalidate)
    },
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

const pseudoStore = ret => ({
    subscribe: run => {
        run(ret())
        return () => {}
    },
})

/**
 * @type {Readable<FragmentContext>}
 */
export const context = pseudoStore(() => contexts.fragment)

export const node = pseudoStore(() => get(context).node)

export const meta = pseudoStore(() => get(node).meta)

export const activeRoute = {
    subscribe: run => contexts.router.activeRoute.subscribe(run),
}

export const pendingRoute = {
    subscribe: run => contexts.router.pendingRoute.subscribe(run),
}
