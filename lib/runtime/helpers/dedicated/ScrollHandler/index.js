import { get } from 'svelte/store'
import { throttle } from '../../../../common/utils.js'
import { getRoutifyFragmentContext } from '../../../utils/index.js'

/**
 * @typedef {Object} ScrollHandlerOptions
 * @property {number} coolOffTime
 * @property {number} throttleTime
 * @property {number} cutoff
 * @property {'both' | 'vertical' | 'horizontal'} direction
 * @property {(context: RouterContext|RenderContext) => HTMLElement[]} getElems
 * @property {RouterContext|RenderContext} context *
 */

/**
 * Fetches all the elements of the inlined child nodes of the given context
 * @param {RouterContext | RenderContext=} context
 * @returns {HTMLElement[]}
 */
export const getChildNodesElements = context =>
    getDescendantOrChildNodeElements(context, 'children')
/**
 * Fetches all the elements of the inlined descendant nodes of the given context
 * @param {RouterContext | RenderContext=} context
 * @returns {HTMLElement[]}
 */
export const getDescendantNodesElements = context =>
    getDescendantOrChildNodeElements(context, 'descendants')

/**
 * Fetches all the elements of the inlined descendant or child nodes of the given context
 * @param {RouterContext | RenderContext | null} context
 * @param {'children' | 'descendants'} prop
 * @returns {HTMLElement[]}
 */
const getDescendantOrChildNodeElements = (context, prop) => {
    /** @type {RenderContext[]} */
    const contexts =
        prop === 'descendants' ? context.descendants : get(context.childContexts)

    return contexts
        .filter(context => context.isInline)
        .map(context => {
            const elem = get(context.elem)
            return elem?.anchor || elem?.parent
        })
        .filter(Boolean)
}

/** @type {ScrollHandlerOptions} */
const defaultOptions = {
    coolOffTime: 500,
    throttleTime: 100,
    cutoff: 0,
    direction: 'both',
    getElems: getChildNodesElements,
    context: undefined,
}

/**
 * ScrollHandler detects when the user scrolls to a new inlined page and updates the router accordingly
 *
 */
export class ScrollHandler {
    /** @type {Route} */
    lastRoute

    /** @type {HTMLElement[]} */
    elems = []

    cutoff = 0

    direction

    /**
     * ScrollHandler2 detects when the user scrolls to a new inlined page and updates the router accordingly
     * @param {Partial<ScrollHandlerOptions>} options
     * */
    constructor(options = {}) {
        this.id = Symbol()
        options = { ...defaultOptions, ...options }
        this.coolOffTime = options.coolOffTime
        this.throttleTime = options.throttleTime
        this.cutoff = options.cutoff
        this.direction = options.direction
        this.getElems = options.getElems
        this.onScrollIsActive = false
        this.stopPersistent = () => null
        this.listenForScroll = true
        this.context = options.context
    }

    onScrollThrottled() {
        throttle(async () => {
            const route = this.context.router.activeRoute.get()
            const routeIsSettled = Date.now() - route?.state.createdAt > this.coolOffTime
            if (routeIsSettled || route?.state.dontScroll) this.onScroll()
            await new Promise(resolve => setTimeout(resolve, this.throttleTime))
        }, this.id)
    }

    onScroll() {
        let candidateElement
        let candidateStartingPos = -Infinity
        if (
            this.context.router.activeRoute.get() !== this.lastRoute ||
            this.context !== this.lastContext
        ) {
            this.lastRoute = this.context.router.activeRoute.get()
            this.lastContext = this.context
            this.elems = this.getElems(this.context).filter(elem =>
                document.body.contains(elem),
            )
        }

        // get the highest element that's not above the cutoff
        for (const element of this.elems) {
            const { top, left } = element.getBoundingClientRect()
            const pos =
                this.direction === 'both'
                    ? top + left
                    : this.direction === 'vertical'
                    ? top
                    : left
            if (pos <= this.cutoff && pos >= candidateStartingPos) {
                candidateElement = element
                candidateStartingPos = pos
            }
        }

        // if there's a candidate and it's not the current active route, set it as active
        if (candidateElement) {
            const contexts = candidateElement['__routify_meta'].renderContext
            const context = contexts.anchor || contexts.parent
            if (context.router.activeRoute.get() != context.route)
                context.router.url.set(context.node.path, 'replaceState', true, {
                    // we got to this route by scrolling manually, so we don't want the router to do any scrolling
                    dontScroll: true,
                })
        }
    }

    subscribe(run) {
        if (!this.context) this.context = getRoutifyFragmentContext()

        // create an event listener that will be called when the scroll event is triggered
        const onScroll = () => this.onScrollThrottled()

        /** @type {HTMLElement|null} */
        let elem
        run(_elem => {
            elem = _elem
            // add the event listener to the scroll event
            if (elem) elem.addEventListener('scroll', onScroll, { capture: true })
            else addEventListener('scroll', onScroll, { capture: true })
        })

        // return a function that will remove the event listener
        return () => {
            if (elem) elem.removeEventListener('scroll', onScroll, { capture: true })
            else removeEventListener('scroll', onScroll, { capture: true })
        }
    }
}
