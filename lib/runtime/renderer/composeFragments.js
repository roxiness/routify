import { get } from 'svelte/store'
import { jsonClone, lazySet } from '../../common/utils'
import { RouteFragment } from '../Route/RouteFragment'
import { RenderContext } from './RenderContext'

/**
 * @param {RenderContext} context
 **/
export const updateVisibility = context => {
    const activeChildContext = get(context.activeChildContext)

    const environment = typeof window !== 'undefined' ? 'browser' : 'ssr'
    const checkIfInline = _context =>
        !_context?.node || _context.inline.isInline(_context?.node, activeChildContext)

    get(context.childContexts).forEach(context => {
        context.isInline = checkIfInline(context)
        const isBothInlined = context.isInline && checkIfInline(activeChildContext)
        const envIsOkay = ['always', environment].includes(context.inline.context)
        const isVisibleAsInlined = isBothInlined && envIsOkay

        context.wasVisible = get(context.isVisible)
        lazySet(context.isActive, context === activeChildContext)
        lazySet(context.isVisible, get(context.isActive) || isVisibleAsInlined)
        // if it's not visible, the element doesn't exist anymore
        if (!get(context.isVisible)) context.elem.set(null)
        // TODO might need this:
        // if (!get(context.isVisible)) context.scrollBoundary.set(null)
    })
}

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
export const fetchIndexNode = node => node.children.find(node => node.name === 'index')

/**
 * @param {RNodeRuntime} node
 */
const findDecorator = node => node?.children.find(node => node.name === '_decorator')

/**
 *
 * @param {Decorator[]} decorators
 * @param {RenderContext} context
 */
export const addFolderDecorator = async (decorators, context) => {
    const folderDecorator = findDecorator(context.node)

    if (!folderDecorator) return

    if (!folderDecorator.module) await folderDecorator.loadModule()

    const options = folderDecorator.module['options'] || {}

    decorators.push({
        component: folderDecorator.module['default'],
        recursive: options.recursive ?? folderDecorator.meta.recursive ?? true,
        shouldRender: options.shouldRender ?? (() => true),
    })
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
 * @param {Partial<{inline: InlineInput, decorator:DecoratorInput, props, options, anchor: AnchorLocation, scrollBoundary: scrollBoundary}>} options
 * @param {RenderContext} parentContext
 * @returns {RenderContext[] }
 * */
export const buildChildContexts = (options, parentContext, newDecorators) => {
    const { childFragments } = parentContext
    const {
        inline: rawInlineInputFromSlot,
        decorator,
        props,
        anchor: anchorLocation,
        options: contextOptions,
        scrollBoundary = defaultscrollBoundary,
    } = options

    const refNode = get(childFragments)[0]?.node

    const parentNode = parentContext?.node || refNode.parent

    const matches = parentNode
        ? parentNode.children.filter(node => node === refNode || nodeIsIndexed(node))
        : [refNode]

    const children = matches.length ? matches : [refNode]

    const paramsPool = jsonClone(rawInlineInputFromSlot?.['params'] || {})

    Object.entries(paramsPool).forEach(([key, values]) => {
        const index = children.findIndex(node => node.paramKeys.includes(key))
        const newChildren = new Array(values.length - 1).fill(children[index])
        // insert the new children after the source
        children.splice(index + 1, 0, ...newChildren)
    })

    return children.map(
        node =>
            new RenderContext({
                node,
                paramsPool,
                rawInlineInputFromSlot,
                parentContext,
                newDecorators,
                contextOptions,
                scrollBoundary,
                anchorLocation,
            }),
    )
}

export const findActiveChildContext = (childContexts, fragment) =>
    childContexts.find(contextHasMatchingFragmentAndParams(fragment)) ||
    childContexts.find(s => s.node === fragment?.node)
