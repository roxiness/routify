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
 * @param {undefined|Boolean|InlinePageInput[]} pagesInput
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
 * @param {boolean|Array|Object} inlineInput
 * @returns {Inline}
 */
const convertToObj = inlineInput =>
    inlineInput instanceof Object
        ? !Array.isArray(inlineInput)
            ? inlineInput
            : { pages: inlineInput }
        : {}

/**
 * normalize inline object. If no pages are specified, use siblings of the refNode
 * @param {InlineInput} inlineInput
 * @param {RNodeRuntime|null} refNode
 * @param {RenderContext} parentContext
 * @returns {Inline}
 */
export const normalizeInline = (inlineInput, refNode, parentContext) => {
    const inline = convertToObj(inlineInput)

    inline.single = inline.single || !inlineInput
    inline.pages = coercePagesToNodes(inline.pages, refNode, parentContext)
    inline.renderInactive = inline.renderInactive || 'browser'

    return inline
}
