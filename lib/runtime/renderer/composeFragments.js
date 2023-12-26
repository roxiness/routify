import { get } from 'svelte/store'
import { RouteFragment } from '../Route/RouteFragment.js'
import { RenderContext } from './RenderContext.js'
import { normalizeWrapper } from './utils/normalizeDecorator.js'

/**
 * check if fragments have the same node and all a params are in b.
 * @param {RouteFragment} f fragment
 * @returns {(c: RenderContext) => boolean}
 */
export const contextHasMatchingFragmentAndParams = f => c =>
    f.node === c.node &&
    Object.entries(f.params).every(([key, value]) => c.fragment.params[key] === value)

/**
 * same as node.pagesWithIndex, except includes dynamic pages
 * @param {RNodeRuntime} node
 */
export const nodeIsIndexed = node =>
    !node.meta.fallback && !node.name.startsWith('_') && node.meta?.order !== false

/** @param {RNodeRuntime} node*/
export const fetchIndexNode = node =>
    node.navigableChildren.find(node => node.meta.isDefault)

// TODO addFolderDecorator should always be synchronous
/**
 *
 * @param {Decorator[]} decorators
 * @param {RenderContext | RouterContext} context
 * @returns {void | Promise<void>}
 */
export const addFolderDecorator = (decorators, context) => {
    const folderDecorator = context['node']?.children.find(node => node.meta.isDecorator)

    if (folderDecorator) {
        const options = folderDecorator.module['decorator'] || {}
        decorators.push({
            component: folderDecorator.module['default'],
            recursive: options.recursive ?? folderDecorator.meta.recursive ?? true,
            shouldRender:
                options.shouldRender ?? folderDecorator.meta.shouldRender ?? (() => true),
        })
    }
}
/**
 *
 * @param {Decorator[]} decorators
 * @param {RenderContext | RouterContext} context
 * @returns {void | Promise<void>}
 */
export const addFolderWrapper = (decorators, context) => {
    const inlineWrapper = context['node']?.children.find(
        node => node.meta.isInlineWrapper,
    )

    if (inlineWrapper) {
        decorators.push(normalizeWrapper(inlineWrapper.module.default))
    }
}

export function findNearestInlineContext(context) {
    return context
        ? context.isInline
            ? context
            : findNearestInlineContext(context.parentContext)
        : null
}

export const defaultscrollBoundary = ownContext =>
    !ownContext.isInline && get(findNearestInlineContext(ownContext)?.elem)?.parent

/**
 * @param {RenderContext[]} childContexts
 * @param {RouteFragment} fragment
 * @returns {RenderContext}
 */
export const findActiveChildContext = (childContexts, fragment) =>
    childContexts.find(contextHasMatchingFragmentAndParams(fragment)) ||
    childContexts.find(s => s.node === fragment?.node)
