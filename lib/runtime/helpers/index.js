import '#root/typedef.js'
import { derived, readable, writable } from 'svelte/store'
import { pathAndParamsToUrl, contexts } from '../utils.js'

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

/** @type {import('svelte/store').Readable<IsActive>} */
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
export const resolveNode = path =>
    path.startsWith('/')
        ? resolveAbsoluteNode(path)
        : path.startsWith('.')
        ? resolveRelativeNode(path)
        : resolveNamedNode(path)

export const resolveAbsoluteNode = path => {
    const context = contexts.fragment
}

/** @param {string} path */
export const resolveRelativeNode = path => {
    let { node } = contexts.fragment

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

export const resolveNamedNode = name => {}
