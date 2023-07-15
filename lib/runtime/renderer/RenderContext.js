import { createSequenceHooksCollection } from 'hookar'
import { get, writable } from 'svelte/store'
import { createDeferredPromise } from '../utils'
import { coerceInlineInputToObject, normalizeInline } from './utils/normalizeInline'
import { RouteFragment } from '../Route/RouteFragment'
import { fetchIndexNode } from './composeFragments'
import { lazySet } from '../../common/utils'

/**
 * @param {RNodeRuntime} node
 * @param {Object.<string, string[]>} pool
 */
const shiftParams = (node, pool) => {
    const params = {}
    node.paramKeys.forEach(key => {
        // If the pool has a value for this parameter, use the value
        // and remove it from the pool.
        if (pool && key in pool) {
            params[key] = pool[key].shift()
        }
    })
    return params
}

export class RenderContext {
    anchorLocation = 'parent'

    /** @type {RNodeRuntime} */
    node

    isActive = writable(false)
    isVisible = writable(false)
    wasVisible = false
    isInline = false

    /** @type {Inline} */
    inline

    /** @type {import('svelte/store').Writable<{ parent: HTMLElement, anchor: HTMLElement }>} */
    elem = writable(null)

    /** @type {Route} */
    route

    /** @type {import('svelte/store').Writable<RenderContext[]>} */
    childContexts = writable([])

    /** @type {import('svelte/store').Writable<RenderContext>} */
    activeChildContext = writable(null)

    /** @type {RenderContext} */
    lastActiveChildContext = null

    onDestroy = createSequenceHooksCollection()

    mounted = createDeferredPromise()

    /**
     *
     * @param {{
     *   node: RNodeRuntime
     *   paramsPool: Object.<string, string[]>
     *   rawInlineInputFromSlot: InlineInput
     *   parentContext: RenderContext
     *   newDecorators: Decorator[]
     *   contextOptions: RenderContextOptions
     *   scrollBoundary: scrollBoundary
     *   anchorLocation: AnchorLocation
     * }} param0
     */
    constructor({
        node,
        paramsPool,
        rawInlineInputFromSlot,
        parentContext,
        newDecorators,
        contextOptions,
        scrollBoundary,
        anchorLocation,
    }) {
        const { route } = parentContext
        this.anchorLocation = anchorLocation || 'parent'
        this.childFragments = writable(
            fetchIndexNode(node) ? [new RouteFragment(route, fetchIndexNode(node))] : [],
        )
        this.node = node
        const params = shiftParams(node, paramsPool)
        this.fragment = new RouteFragment(route, node, null, params)

        this.inline = normalizeInline({
            ...coerceInlineInputToObject(rawInlineInputFromSlot),
            ...coerceInlineInputToObject(node.meta.inline),
        })
        this.router = parentContext.router

        this.parentContext = parentContext.node && parentContext
        this.decorators = newDecorators
        this.options = contextOptions || {}
        this.scrollBoundary = scrollBoundary
    }

    updateVisibility() {
        const activeContext = get(this.activeChildContext)
        const environment = typeof window !== 'undefined' ? 'browser' : 'ssr'

        const checkIfInline = _context =>
            !_context?.node || _context.inline.isInline(_context?.node, activeContext)

        const context = this

        context.isInline = checkIfInline(context)
        const isBothInlined = context.isInline && checkIfInline(activeContext)
        const envIsOkay = ['always', environment].includes(context.inline.context)
        const isVisibleAsInlined = isBothInlined && envIsOkay

        context.wasVisible = get(context.isVisible)
        lazySet(context.isActive, context === activeContext)
        lazySet(context.isVisible, get(context.isActive) || isVisibleAsInlined)
        // if it's not visible, the element doesn't exist anymore
        if (!get(context.isVisible)) context.elem.set(null)
        // TODO might need this:
        // if (!get(context.isVisible)) context.scrollBoundary.set(null)
    }
}
