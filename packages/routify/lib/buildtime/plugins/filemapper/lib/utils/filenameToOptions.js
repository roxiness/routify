import { nameFilter } from '../../utils.js'

/**
 * assign reset, fallback and dynamic paths to node.meta
 * @param {RNodeBuildtime} node
 */
export const filenameToOptions = node => {
    const { descendants } = node

    const { extensions } = node.instance.options
    const { resetFiles, fallbackFiles } = node.instance.options.filemapper

    const resetNames = resetFiles.map(name => extensions.map(ext => name + ext)).flat()
    const fallbackNames = fallbackFiles
        .map(name => extensions.map(ext => name + ext))
        .flat()

    // set meta.reset for _reset.svelte
    descendants.filter(nameFilter(resetNames)).forEach(node => (node.meta.reset = true))

    // set meta.fallback for _fallback.svelte
    descendants
        .filter(nameFilter(fallbackNames))
        .forEach(node => (node.meta.fallback = true))

    // set meta.dynamic for files with attribute in name
    descendants
        .filter(node => node.file && node.file.name.match(/\[.+\]/))
        .forEach(node => (node.meta.dynamic = true))
}
