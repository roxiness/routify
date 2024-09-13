import { get } from 'svelte/store'
import { throttle } from '../../../../common/utils.js'
import { getRoutifyFragmentContext } from '../../../utils/index.js'
import { url } from '../../index.js'

/**
 * @typedef {Object} RouteOnScrollOptions
 * @property {number} threshold - The threshold at which the strategy is triggered.
 * @property {'both' | 'vertical' | 'horizontal'} direction - Defines the scroll direction to be monitored.
 * @property {'lowestAboveThreshold'|'withinThreshold'|'closest'} strategy -
 *    - 'lowestAboveThreshold': Selects the item just above the threshold.
 *    - 'withinThreshold': Selects any item within the threshold range.
 *    - 'closest': Selects the item closest to the boundary anchor, regardless of position.
 * @property { 'left'|'center'|'right' } boundaryAnchorX - X anchor point for boundary alignment.
 * @property { 'top'|'center'|'bottom' } boundaryAnchorY - Y anchor point for boundary alignment.
 * @property { 'left'|'center'|'right' } targetAnchorX - X anchor point for target alignment.
 * @property { 'top'|'center'|'bottom' } targetAnchorY - Y anchor point for target alignment.
 */

/**
 * @typedef {Object} BaseRouteOnScrollOptions
 * @property {number} threshold
 * @property {number} coolOffTime
 * @property {number} throttleTime
 * @property {(context: RouterContext|RenderContext) => HTMLElement[]} getElems
 * @property {RouterContext|RenderContext} context
 * @property {(elems: HTMLElement[]) => HTMLElement} findFocusedElement
 * @property {'scroll'|'scrollend'} scrollEvent
 * @property {import('../../index.js').Url} $url urlHelper
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
        prop === 'descendants' ? context['descendants'] : get(context['childContexts'])

    return contexts
        .filter(context => context.isInline)
        .map(context => {
            const elem = get(context.elem)
            return elem?.anchor || elem?.parent
        })
        .filter(Boolean)
}

/** @type {BaseRouteOnScrollOptions} */
const defaultOptions = {
    threshold: 0,
    coolOffTime: 500,
    throttleTime: 100,
    getElems: getChildNodesElements,
    context: undefined,
    findFocusedElement: null,
    scrollEvent: 'scroll',
    $url: null,
}

/**
 * RouteOnScroll detects when the user scrolls to a new inlined page and updates the router accordingly
 *
 */
export class BaseRouteOnScroll {
    /** @type {Route} */
    lastRoute

    /** @type {HTMLElement[]} */
    elems = []

    direction

    /** @type {HTMLElement} */
    boundaryElem

    /**
     * RouteOnScroll detects when the user scrolls to a new inlined page and updates the router accordingly
     * @param {Partial<BaseRouteOnScrollOptions>} options
     * */
    constructor(options = {}) {
        this.id = Symbol()
        this.$url = options.$url
        options = { ...defaultOptions, ...options }
        this.coolOffTime = options.coolOffTime
        this.throttleTime = options.throttleTime
        this.getElems = options.getElems
        this.onScrollIsActive = false
        this.stopPersistent = () => null
        this.listenForScroll = true
        this.context = options.context
        if (options.findFocusedElement)
            this.findFocusedElement = options.findFocusedElement
        this.scrollEvent = options.scrollEvent
    }

    /**
     * @param HTMLElement[]
     * @returns {HTMLElement}
     */
    findFocusedElement(elems) {
        throw new Error('findFocusedElement not implemented')
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

        const focusedElement = this.findFocusedElement(this.elems)

        // if there's a candidate and it's not the current active route, set it as active
        if (focusedElement) {
            const contexts = focusedElement['__routify_meta'].renderContext
            const context = contexts.anchor || contexts.parent
            if (context.router.activeRoute.get() != context.route) {
                const url = this.$url(context.node.path, get(context.params))
                context.router.url.set(url, 'replaceState', true, {
                    // we got to this route by scrolling manually, so we don't want the router to do any scrolling
                    dontScroll: true,
                })
            }
        }
    }

    subscribe(run) {
        if (!this.context) this.context = getRoutifyFragmentContext()
        if (!this.$url) this.$url = get(url)

        // create an event listener that will be called when the scroll event is triggered
        const onScroll = () => this.onScrollThrottled()

        run(_elem => {
            this.boundaryElem = _elem
            // add the event listener to the scroll event
            if (this.boundaryElem)
                this.boundaryElem.addEventListener(this.scrollEvent, onScroll, {
                    capture: true,
                })
            else addEventListener(this.scrollEvent, onScroll, { capture: true })
        })

        // return a function that will remove the event listener
        return () => {
            if (typeof window === 'undefined') return
            if (this.boundaryElem)
                this.boundaryElem.removeEventListener(this.scrollEvent, onScroll, {
                    capture: true,
                })
            else removeEventListener(this.scrollEvent, onScroll)
        }
    }
}

export class RouteOnScroll extends BaseRouteOnScroll {
    /**
     * RouteOnScroll detects when the user scrolls to a new inlined page and updates the router accordingly
     * @param {Partial<BaseRouteOnScrollOptions & RouteOnScrollOptions>} options
     * */
    constructor(options = {}) {
        super(options)
        this.threshold = options.threshold || 0
        this.direction = options.direction || 'both'
        this.strategy = options.strategy || 'lowestAboveThreshold'
        const defaultX = this.strategy === 'closest' ? 'center' : 'left'
        const defaultY = this.strategy === 'closest' ? 'center' : 'top'
        this.boundaryAnchorX = options.boundaryAnchorX || defaultX
        this.boundaryAnchorY = options.boundaryAnchorY || defaultY
        this.targetAnchorX = options.targetAnchorX || defaultX
        this.targetAnchorY = options.targetAnchorY || defaultY
    }

    /**
     * @param {HTMLElement} element
     */
    getElementPos(element, xPos = 'left', yPos = 'top') {
        if (!element?.getBoundingClientRect) return [0, 0]
        const domRekt = element.getBoundingClientRect()

        const x = xPos === 'center' ? domRekt.left + domRekt.width / 2 : domRekt[xPos]
        const y = yPos === 'center' ? domRekt.top + domRekt.height / 2 : domRekt[yPos]

        return [x, y]
    }

    findFocusedElement(elems) {
        let candidateElement
        let candidateValue = this.strategy === 'closest' ? Infinity : -Infinity
        let candidateValueX = this.strategy === 'closest' ? Infinity : -Infinity
        let candidateValueY = this.strategy === 'closest' ? Infinity : -Infinity

        const boundaryElemPos = this.getElementPos(
            this.boundaryElem,
            this.boundaryAnchorX,
            this.boundaryAnchorY,
        )

        // iterate over all the elements and find the one that's closest to the boundary element
        for (const element of elems) {
            const elementPos = this.getElementPos(
                element,
                this.targetAnchorX,
                this.targetAnchorY,
            )

            // position relative to the boundary element
            const xPos = elementPos[0] - boundaryElemPos[0]
            const yPos = elementPos[1] - boundaryElemPos[1]
            // distance from the boundary element
            const xDist = Math.abs(xPos)
            const yDist = Math.abs(yPos)
            const dist = Math.sqrt(xDist * xDist + yDist * yDist)

            // get the lowest element that's above the threshold
            if (this.strategy === 'lowestAboveThreshold') {
                if (
                    this.direction === 'both' &&
                    xPos <= this.threshold &&
                    yPos <= this.threshold &&
                    xPos >= candidateValueX &&
                    yPos >= candidateValueY
                ) {
                    candidateElement = element
                    candidateValueX = xPos
                    candidateValueY = yPos
                } else if (
                    this.direction === 'horizontal' &&
                    xPos <= this.threshold &&
                    xPos >= candidateValueX
                ) {
                    candidateElement = element
                    candidateValueX = xPos
                } else if (
                    this.direction === 'vertical' &&
                    yPos <= this.threshold &&
                    yPos >= candidateValueY
                ) {
                    candidateElement = element
                    candidateValueY = yPos
                }
            } else if (this.strategy === 'closest') {
                if (dist < candidateValue) {
                    candidateElement = element
                    candidateValue = dist
                }
            } else if (this.strategy === 'withinThreshold') {
                if (this.direction === 'both') {
                    if (dist <= this.threshold) return element
                } else if (this.direction === 'horizontal') {
                    if (xDist <= this.threshold) return element
                } else if (this.direction === 'vertical') {
                    if (yDist <= this.threshold) return element
                }

                // if (pos <= this.threshold && pos >= -this.threshold) return element
            }
        }
        return candidateElement
    }
}
