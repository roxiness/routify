/**

 */

import { get } from 'svelte/store'
import { waitFor } from '../../utils'

/**
 *
 * @param {RNodeRuntime} node
 */
const nodeIsPage = node =>
    !node.meta.fallback && !node.name.startsWith('_') && node.meta?.order !== false

/**
 * @param {RNodeRuntime} refNode
 * @param {RenderContext} parentContext
 */
const getChildren = (refNode, parentContext) => {
    const parentNode = parentContext?.node || refNode.parent

    const matches = parentNode
        ? parentNode.children.filter(node => node === refNode || nodeIsPage(node))
        : [refNode]

    return matches.length ? matches : [refNode]
}

/**
 * @param {RNodeRuntime | string} nodeOrString
 */
const coerceStringToNode = (nodeOrString, refNode) =>
    typeof nodeOrString === 'string' ? refNode.traverse(nodeOrString) : nodeOrString

/**
 * @param {undefined|Boolean|MultiPageInput[]} pagesInput
 * @param {RNodeRuntime} refNode
 * @param {RenderContext} parentContext
 * @returns {RNodeRuntime[]}
 */
const coercePagesToNodes = (pagesInput, refNode, parentContext) => {
    const pageInputs = Array.isArray(pagesInput)
        ? pagesInput
        : getChildren(refNode, parentContext)
    return pageInputs.map(page => coerceStringToNode(page, refNode))
}

/**
 * @param {boolean|Array|Object} multiInput
 * @returns {Multi}
 */
const convertToObj = multiInput =>
    multiInput instanceof Object
        ? !Array.isArray(multiInput)
            ? multiInput
            : { pages: multiInput }
        : {}

/**
 * normalize multi object. If no pages are specified, use siblings of the refNode
 * @param {MultiInput} multiInput
 * @param {RNodeRuntime|null} refNode
 * @param {RenderContext} parentContext
 * @returns {Multi}
 */
export const normalizeMulti = (multiInput, refNode, parentContext) => {
    const multi = convertToObj(multiInput)

    multi.single = multi.single || !multiInput
    multi.pages = coercePagesToNodes(multi.pages, refNode, parentContext)
    multi.renderInactive = multi.renderInactive || 'browser'

    return multi
}
