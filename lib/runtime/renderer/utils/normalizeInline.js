/**
 * normalize inline object. If no pages are specified, use siblings of the refNode
 * @param {InlineInput|null} inlineInput
 * @returns {Partial<Inline>}
 */
export const coerceInlineInputToObject = inlineInput => {
    if (typeof inlineInput === 'undefined') return {}

    return {
        // if inline is true, callback will return true
        shouldInline: () => !!inlineInput,

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
    shouldInline: () => false,

    scrollIntoView: elem => elem.scrollIntoView({ inline: 'center' }),
    context: 'browser',
    ...inlineInput,

    // If a function is passed, it will be used as the callback.
    // If undefined, the callback will return true if it's the last element in the array.
    // Otherwise, it will return true if inline is true.
    shouldScroll:
        typeof inlineInput.shouldScroll === 'function'
            ? inlineInput.shouldScroll
            : typeof inlineInput.shouldScroll === 'undefined'
            ? (ctx, index, arr, defaultCallback) => defaultCallback(ctx, index, arr)
            : () => !!inlineInput.shouldScroll,
})
