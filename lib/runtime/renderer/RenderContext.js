import { createSequenceHooksCollection } from 'hookar'
import { get, writable } from 'svelte/store'
import { createDeferredPromise } from '../utils'
import { coerceInlineInputToObject, normalizeInline } from './utils/normalizeInline'
import { RouteFragment } from '../Route/RouteFragment'
import { defaultscrollBoundary, fetchIndexNode, nodeIsIndexed } from './composeFragments'
import { jsonClone, lazySet } from '../../common/utils'

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

export class RouterContext {
    /** @type {import('svelte/store').Writable<RenderContext[]>} */
    childContexts = writable([])

    /** @type {import('svelte/store').Writable<RouteFragment[]>} */
    childFragments = writable([])

    /** @type {import('svelte/store').Writable<RenderContext>} */
    activeChildContext = writable(null)

    /** @type {RenderContext} */
    lastActiveChildContext = null

    /** @type {Decorator[]} */
    decorators = []

    /** @param {{router: Router}} params */
    constructor({ router }) {
        this.router = router
        this.route = router.activeRoute.get()
    }

    /**
     * @param {Partial<{inline: InlineInput, decorator:DecoratorInput, props, options, anchor: AnchorLocation, scrollBoundary: scrollBoundary}>} options
     *
     * */
    buildChildContexts(options, newDecorators) {
        const { childFragments } = this
        const {
            inline: rawInlineInputFromSlot,
            decorator,
            props,
            anchor: anchorLocation,
            options: contextOptions,
            scrollBoundary = defaultscrollBoundary,
        } = options

        const refNode = get(childFragments)[0]?.node

        const parentNode = this?.['node'] || refNode.parent

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

        const childContexts = children.map(
            node =>
                new RenderContext({
                    node,
                    paramsPool,
                    rawInlineInputFromSlot,
                    parentContext: this,
                    newDecorators,
                    contextOptions,
                    scrollBoundary,
                    anchorLocation,
                }),
        )
        this.childContexts.set(childContexts)
    }
}

export class RenderContext extends RouterContext {
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

    onDestroy = createSequenceHooksCollection()

    mounted = createDeferredPromise()

    /** @type {RouterContext} */
    routerContext

    /**
     *
     * @param {{
     *   node: RNodeRuntime
     *   paramsPool: Object.<string, string[]>
     *   rawInlineInputFromSlot: InlineInput
     *   parentContext: RenderContext | RouterContext
     *   newDecorators: Decorator[]
     *   contextOptions: RenderContextOptions
     *   scrollBoundary: scrollBoundary
     *   anchorLocation: AnchorLocation
     *   router?: Router
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
        router,
    }) {
        super({ router: router || parentContext.router })
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

        // parentContext is an instance of RenderContext
        // if it's not, it's an instance of RouterContext
        if (parentContext instanceof RenderContext) {
            this.routerContext = parentContext.routerContext
            this.parentContext = parentContext
        } else this.routerContext = parentContext

        // this.parentContext = parentContext
        this.decorators = newDecorators
        this.options = contextOptions || {}
        this.scrollBoundary = scrollBoundary
    }

    get parentOrRouterContext() {
        return this.parentContext || this.routerContext
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

    setToActive() {
        const parentContext = this.parentOrRouterContext
        const [fragment, ...fragments] = get(parentContext.childFragments)
        this.fragment = fragment
        this.childFragments.set(fragments)
        this.route = parentContext.route
        fragment.renderContext.resolve(this)

        parentContext.lastActiveChildContext = get(parentContext.activeChildContext)
        parentContext.activeChildContext.set(this)
    }
}
