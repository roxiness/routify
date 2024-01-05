import { createSequenceHooksCollection } from 'hookar'
import { get, writable } from 'svelte/store'
import { createDeferredPromise } from '../utils/index.js'
import { coerceInlineInputToObject, normalizeInline } from './utils/normalizeInline.js'
import { RouteFragment } from '../Route/RouteFragment.js'
import { defaultscrollBoundary, fetchIndexNode } from './composeFragments.js'
import { jsonClone, lazySet } from '../../common/utils.js'

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

    /** @type {import('../decorators/AnchorDecorator').Location}*/
    anchorLocation

    get descendants() {
        return get(this.childContexts).reduce(
            (acc, context) => [...acc, ...context.descendants],
            get(this.childContexts),
        )
    }

    /**
     *  @param {{ router: Router }} params
     **/
    constructor({ router }) {
        this.router = router
        this.route = router.activeRoute.get()
        this.anchorLocation = router.anchor
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

        // the ref node is the first child fragment and may not always be a child of the parent node, since `resets` can be used
        const refNode = get(childFragments)[0]?.node

        const node = this?.['node'] || refNode.parent

        const children = [...(node?.navigableChildren || [])]
        if (refNode && !children.includes(refNode)) children.unshift(refNode)

        const paramsPool = jsonClone(rawInlineInputFromSlot?.['params'] || {})

        // add a child for each value in the params pool
        // each child corresponds to the respective key key
        Object.entries(paramsPool).forEach(([key, values]) => {
            const sourceIndex = children.findIndex(node => node.paramKeys.includes(key))
            const newChildNodes = new Array(values.length - 1).fill(children[sourceIndex])
            // insert the new children after the source
            children.splice(sourceIndex + 1, 0, ...newChildNodes)
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
                    props,
                }),
        )
        this.childContexts.set(childContexts)
    }

    updateChildren() {
        const activeChildContext = get(this.activeChildContext)
        get(this.childContexts).forEach(context => context.update(activeChildContext))
    }
}

export class RenderContext extends RouterContext {
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
     *   props: Object
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
        props,
    }) {
        super({ router: router || parentContext.router })
        this.anchorLocation = anchorLocation || 'parent'

        this.node = node
        this.props = props
        if (!node) console.trace('node')
        const params = shiftParams(node, paramsPool)
        this.fragment = new RouteFragment(null, node, null, params)
        // if this is a module and it has an index, add it to the child fragments
        this.childFragments = writable(
            fetchIndexNode(node) ? [new RouteFragment(null, fetchIndexNode(node))] : [],
        )
        this.params = writable({})

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

        this.decorators = newDecorators
        this.options = contextOptions || {}
        this.scrollBoundary = scrollBoundary
    }

    get parentOrRouterContext() {
        return this.parentContext || this.routerContext
    }

    get ancestors() {
        const ancestors = []
        let context = this.parentContext
        while (context) {
            ancestors.push(context)
            context = context.parentContext
        }
        return ancestors
    }

    /**
     * Returns all the props of the context, including the ones from the parent contexts.
     * @type {Object<string|number|symbol, any>}
     */
    get allProps() {
        return Object.assign({}, this.parentContext?.allProps, this.props)
    }

    setToActive() {
        const parentContext = this.parentOrRouterContext
        const [fragment, ...fragments] = get(parentContext.childFragments)
        this.fragment = fragment
        this.childFragments.set(fragments)
        // this is where the route is inherited from the parent context
        // before this point, the route is null
        this.route = parentContext.route
        fragment.renderContext.resolve(this)
        parentContext.lastActiveChildContext = get(parentContext.activeChildContext)

        parentContext.activeChildContext.set(this)

        this.isInline = this.inline.isInline(this.node, this)
    }

    update(activeSiblingContext) {
        this.router.log.verbose('updating renderContext', this.node.name) // ROUTIFY-DEV-ONLY
        const environment = typeof window !== 'undefined' ? 'browser' : 'ssr'

        this.isInline = this.inline.isInline(this.node, activeSiblingContext)
        const activeContextIsStandalone =
            activeSiblingContext && !activeSiblingContext.isInline

        const envIsOkay = ['always', environment].includes(this.inline.context)
        const isIncluded = this.isInline && !activeContextIsStandalone && envIsOkay
        const isDefault = !activeSiblingContext && this.node.name === 'index'
        this.wasVisible = get(this.isVisible)
        lazySet(
            this.isActive,
            this === activeSiblingContext ||
                (!activeSiblingContext && this.node.meta.isDefault),
        )
        lazySet(this.isVisible, get(this.isActive) || isIncluded || isDefault)
        // if it's not visible, the element doesn't exist anymore
        if (!get(this.isVisible)) this.elem.set(null)
        // TODO might need this:
        // if (!get(context.isVisible)) context.scrollBoundary.set(null)
        this.updateParams()
    }

    /** updates params with accumulated values, starting from the root context */
    updateParams() {
        /** @type {RenderContext} */
        let context = this
        const contexts = []
        while (context) {
            contexts.push(context)
            context = context.parentContext
        }
        contexts.reverse()
        this.params.set(
            Object.assign({}, ...contexts.map(context => context.fragment.params)),
        )
    }
}
