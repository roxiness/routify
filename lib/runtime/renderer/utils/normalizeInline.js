/**
 * normalize inline object. If no pages are specified, use siblings of the refNode
 * @param {InlineInput} inlineInput
 * @returns {Partial<Inline>}
 */
export const coerceInlineInputToObject = inlineInput => {
    if (typeof inlineInput === 'undefined') return {}
    else
        return {
            callback: () => !!inlineInput,
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
    context: 'browser',
    ...inlineInput,
})
