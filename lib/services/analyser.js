const fsa = require('../utils/fsa')
const { asyncForEach, splitString } = require('../utils')
const path = require('path')

module.exports = async function analyser({ pages, ignore }) {
  ignore = Array.isArray(ignore) ? ignore : [ignore]
  return await getFiles(pages, ['html', 'svelte'], ignore)
}

async function getFiles(
  absoluteDir,
  extensions,
  ignore,
  _path = '',
  _nested = false,
  layouts = []
) {
  const list = []
  const files = await fsa.readdir(absoluteDir)
  const sortedFiles = moveToFront(files, ['_layout.svelte', '_reset.svelte'])
  await asyncForEach(sortedFiles, async filename => {
    const ignoreFile = ignore.filter(ignoreStr => filename.match(ignoreStr))
      .length
    if (ignoreFile) return

    const _filepath = path.resolve(absoluteDir + '/' + filename)
    const isDir = (await fsa.stat(_filepath)).isDirectory()
    const [noExtName, ext] = splitString(filename, '.')

    const isLayout = ['_layout', '_reset'].includes(noExtName)
    const isReset = ['_reset'].includes(noExtName)
    const isFallback = noExtName === '_fallback'
    const filepath = _path + '/' + filename

    if (!isLayout && !isFallback && filename.match(/^_/)) return //skip underscore prefixed files that aren't layout

    if (isReset) layouts = []

    if (isLayout) layouts.push({ filepath, path: _path + '/' })

    if (isDir) {
      const nestedList = await getFiles(
        _filepath,
        extensions,
        ignore,
        filepath,
        true,
        [...layouts]
      )
      list.push(...nestedList)
    }
    if (extensions.includes(ext))
      list.push({ filepath, layouts, isLayout, isFallback })
  })
  return list
}

function moveToFront(array, names) {
  const sortedArray = []
  names.forEach(name => {
    const pos = array.indexOf(name)
    if (pos !== -1) sortedArray.push(array.splice(pos, 1)[0])
  })
  sortedArray.push(...array)
  return sortedArray
}
