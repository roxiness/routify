import { writable } from 'svelte/store'
import '../typedef.js'

/**
 * writable with subscription hooks
 * @param {any} value
 */
export const writable2 = value => {
    let subscribers = []
    let { set, subscribe, update } = writable(value)

    const hooks = {
        onSub: () => {},
        onUnsub: () => {},
        onFirstSub: () => {},
        onLastUnsub: () => {},
    }

    const newSubscribe = (run, invalidator) => {
        // hooks
        hooks.onSub()
        if (!subscribers.length) hooks.onFirstSub()

        const unsub = subscribe(run, invalidator)
        subscribers.push(unsub)
        return () => {
            hooks.onUnsub()
            if (subscribers.length === 1) hooks.onLastUnsub()

            subscribers = subscribers.filter(_unsub => _unsub !== unsub)
            unsub()
        }
    }

    return {
        set,
        subscribe: newSubscribe,
        update,
        subscribers,
        hooks,
    }
}

export const isDescendantElem = parent => elem => {
    while ((elem = elem.parentNode)) if (elem === parent) return true
    return false
}

export const getUrlFromClick = boundaryElement => event => {
    if (!isDescendantElem(boundaryElement)(event.target)) return false

    const el = event.target.closest('a')
    const href = el && el.href

    if (
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.shiftKey ||
        event.button ||
        (event.key && event.key !== 'Enter') ||
        event.defaultPrevented
    )
        return
    if (!href || el.target || el.host !== location.host) return

    const url = new URL(href)
    const relativeUrl = url.pathname + url.search + url.hash

    event.preventDefault()
    return relativeUrl
}

/**
 * @param {RNodeRuntime} rootNode
 * @param {string} $url
 * @returns {PathNode[]}
 */
export const getPathNodesFromUrlAndNodes = (rootNode, $url) => {
    const [, ...pathFragments] = $url.replace(/\/$/, '').split('/')

    let node = rootNode

    /** @type {PathNode[]} */
    const pathNodes = [new PathNode(node, '')] // start with rootNode

    for (const pathFragment of pathFragments) {
        // child by name
        const child =
            node.children.find(child => child.name === pathFragment) ||
            node.children.find(child => child.regex.test(pathFragment))

        if (child) {
            node = child
            pathNodes.push(new PathNode(node, pathFragment))
        } else {
            const fallbackIndex = pathNodes
                .map(pn => !!pn.node.fallback)
                .lastIndexOf(true)

            if (fallbackIndex === -1)
                throw new Error(
                    `${rootNode.rootName} could not find route: ${$url}`,
                )

            pathNodes.splice(fallbackIndex + 1)
            pathNodes.push(pathNodes[fallbackIndex].node.fallback)
            break
        }
    }

    let lastNode = pathNodes[pathNodes.length - 1].node
    while (lastNode) {
        lastNode = lastNode.children.find(node => node.name === 'index')
        if (lastNode) pathNodes.push(new PathNode(lastNode, ''))
    }

    const pathNodesWithComponent = pathNodes.filter(
        pathNode => pathNode && pathNode.node.component,
    )

    if (!pathNodesWithComponent.length)
        throw new Error(`could not find route: ${$url}`)

    return pathNodesWithComponent
}

class PathNode {
    /**
     *
     * @param {RNodeRuntime} node
     * @param {String} pathFragment
     */
    constructor(node, pathFragment) {
        this.node = node
        this.pathFragment = pathFragment
    }

    get params() {
        const {
            getFieldsFromName,
            getValuesFromPath,
            mapFieldsWithValues,
        } = this.node.instance.utils
        return mapFieldsWithValues(
            getFieldsFromName(this.node.name),
            getValuesFromPath(this.node.regex, this.pathFragment),
        )
    }
}

// TODO ADD TEST
/**
 *
 * @param {string} path
 * @param {Object.<string|number,string|number>} params
 * @param {function} queryHandler
 * @returns {string}
 */
export const pathAndParamsToUrl = (path, params, queryHandler) => {
    Object.entries(params).forEach(([key, val]) => {
        if (path.includes(`[${key}]`)) {
            path = path.replace(`[${key}]`, val)
            delete params[key]
        }
    })

    return path + queryHandler(params)
}

export const fromEntries = iterable => {
    return [...iterable].reduce((obj, [key, val]) => {
        obj[key] = val
        return obj
    }, {})
}
