/**
 * @param {string | ({default: string} & Object.<string, string>)} input
 * @returns {{default: string} & Object.<string, string>}
 */
export const normalizeRoutesDir = input =>
    typeof input === 'string' ? { default: input } : input
