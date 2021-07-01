import '#root/typedef.js'
import { derived, readable, writable } from 'svelte/store'
import { pathAndParamsToUrl, contexts } from '../utils.js'

/**
 * @template T
 * @typedef {import('svelte/store').Readable<T>} Readable
 */

/**
 * @typedef {Object} IsActiveOptions
 * @prop {Boolean} [recursive=true] return true if descendant is active
 */

/**
 * @callback IsActive
 * @param {String=} path
 * @param {Object.<string,string>} [params]
 * @param {IsActiveOptions} [options]
 * @returns {Boolean}
 */

/** @type {Readable<IsActive>} */
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
        ? resolveRelativeNode(node, path)
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
export const resolveRelativeNode = (node, path) => {
    const directions = path
        .split('/')
        .filter(snip => snip !== '.')
        .filter(Boolean)

    const target = directions.reduce(
        (target, direction) =>
            direction === '..' ? target.parent : target.children[direction],
        node,
    )

    return target
}

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
