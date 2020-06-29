const picomatch = require('picomatch')
const fsa = require('../utils/fsa')
const { nope, filter, mapAsync } = require('../utils/fp')
const path = require('path')

/**
 * Generate a file tree
 * @param {TreePayload} payload 
 */
const generateFileTree = async (payload) => {
    const { ignore, extensions, pages, routifyDir } = payload.options
    const isIgnored = ignore ? picomatch(ignore) : nope
    const importBasePath = path.relative(await fsa.realpath(routifyDir), pages).replace(/\\/g, '/');

    payload.tree = {
        name: 'root',
        filepath: '/',
        root: true,   
        ownMeta: {},
        absolutePath: pages
    }
    

    payload.tree.children = await getSubtree(pages)

    /**
     * 
     * @param {String} absoluteDir 
     * @param {String} relativeDir 
     * @param {TreePayload|*} parent 
     */
    function getSubtree(absoluteDir = "", relativeDir = '', parent = payload.tree) {
        return fsa
            .readdir(absoluteDir)
            .then(
                mapAsync(async filename => {
                    const absolutePath = path.resolve(absoluteDir, filename).replace(/\\/g, '/')
                    const isDir = await isDirectory(absolutePath, fsa)
                    const [name, ext, badExt] = isDir
                        ? [filename, '', false]
                        : matchExtension(extensions, filename)
                    const filepath = `${relativeDir}/${filename}`

                    if (badExt) return false

                    const file = {
                        isFile: !isDir,
                        isDir,
                        file: filename,
                        filepath,
                        name,
                        ext,
                        badExt,
                        absolutePath,
                        getParent() { return parent }
                    }

                    if (isDir) {
                        file.children = isAcceptedDir(file, isDir, isIgnored)
                            ? await getSubtree(absolutePath, filepath, file)
                            : []
                    } else {
                      file.importPath = importBasePath + file.filepath;
                    }

                    return file
                })
            )
            .then(filter(Boolean))
    }
}

async function isDirectory(file, fsa) {
    const stat = await fsa.stat(file)
    return stat.isDirectory()
}

function matchExtension(extensions, name) {
    const matched = extensions.find(ext => {
        const { length: l } = ext
        return name.slice(-l) === ext && name.slice(l - 1, l)
    })
    if (matched) {
        const { length: l } = matched
        const basename = name.slice(0, -l - 1)
        return [basename, matched, false]
    } else {
        const [basename, ext] = name.split('.')
        return [basename, ext, true]
    }
}

function isAcceptedDir({ name, filepath }, isDir, isIgnored) {
    const isUnderscored = name.match(/^_/)
    return isDir && !isUnderscored && !isIgnored(filepath)
}

module.exports = { generateFileTree }