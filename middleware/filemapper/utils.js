
/**
 * returns an array filter that checks against filename
 * @param {strings[]} names 
 */
export const nameFilter = names => node => node.file && names.includes(node.file.base)