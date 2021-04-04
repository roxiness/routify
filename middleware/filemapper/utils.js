
/**
 * returns an array filter that checks against filename
 * @param {strings[]} names 
 */
export const nameFilter = names => node => names.includes(node.file.base)