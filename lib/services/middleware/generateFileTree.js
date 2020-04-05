const picomatch = require('picomatch')
const fsa = require('../../utils/fsa')
const { nope, filter, mapAsync } = require('../../utils/fp')
const path = require('path')

const matchExtension = (extensions, name) => {
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

const generateFileTree = ({ ignore, extensions }) => {
    const isIgnored = ignore ? picomatch(ignore) : nope

    const getSubtree = (absoluteDir, relativeDir = '', parent = {}) =>
        fsa
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
                        file: filename,
                        filepath,
                        name,
                        ext,
                        badExt,
                        absolutePath,
                        getParent() { return parent }
                    }

                    if (isDir) {
                        file.dir = isAcceptedDir(file, isDir, isIgnored)
                            ? await getSubtree(absolutePath, filepath, file)
                            : []
                    }

                    return file
                })
            )
            .then(filter(Boolean))

    return getSubtree
}

async function isDirectory(file, fsa) {
    const stat = await fsa.stat(file)
    return stat.isDirectory()
  }

module.exports = { generateFileTree }

function isAcceptedDir({ name, filepath }, isDir, isIgnored) {
    const isUnderscored = name.match(/^_/)
    return isDir && !isUnderscored && !isIgnored(filepath)
  }
