/**
 * @param {string | (Object.<string, string>)} input
 * @returns {Object.<string, string>}
 */
export const normalizeRoutesDir = input =>
    typeof input === 'string' ? { default: input } : input
