import '#root/typedef.js'
import { derived } from 'svelte/store'
import { pathAndParamsToUrl, contexts, populateUrl } from '../utils/index.js'

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
        const offset = new RegExp(`^${router.offset?.path || ''}`)
        return derived(router.params, prevParams => {
            return (inputPath, userParams) => {
                const params = { ...(prevParams || {}), ...(userParams || {}) }
                const node = traverseNode(originNode, inputPath)
                const path = node?.path.replace(offset, '') || ''
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

/**
 * @type {Readable<FragmentContext>}
 */
export const context = {
    subscribe: (run, invalidate) => {
        run(contexts.fragment)
        return function () {}
    },
}

export const node = derived(context, $context => $context.node)

export const meta = derived(node, $node => $node.meta)

export const activeRoute = {
    subscribe: run => contexts.router.activeRoute.subscribe(run),
}

export const pendingRoute = {
    subscribe: run => contexts.router.pendingRoute.subscribe(run),
}
