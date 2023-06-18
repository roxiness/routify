/**
 * normalize inline object. If no pages are specified, use siblings of the refNode
 * @param {InlineInput} inlineInput
 * @returns {Partial<Inline>}
 */
export const coerceInlineInputToObject = inlineInput => {
    if (typeof inlineInput === 'undefined') return {}
    else
        return {
            callback: () => !!inlineInput, // if inline is true, callback will return true
            // @ts-ignore
            ...inlineInput,
        }
}

/**
 *
 * @param {Partial<Inline>} inlineInput
 * @returns {Inline}
 */
export const normalizeInline = inlineInput => ({
    callback: () => false,
    scrollIntoView: elem => elem.scrollIntoView(),
    context: 'browser',
    ...inlineInput,
})
