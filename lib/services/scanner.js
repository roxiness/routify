const fsa = require('../utils/fsa')
const { splitString, flatten } = require('../utils')
const path = require('path')

module.exports = async function analyser({ pages, ignore }) {
  ignore = Array.isArray(ignore) ? ignore : [ignore]
  return await getFiles(pages, ['html', 'svelte'], ignore)
}


/**
 * returns { 
 *   filepath: '/path/to/file.svelte',
 *   layouts: Object[],
 *   isLayout: bool,
 *   isFallback: bool },
 *   hasParam: bool },
 */

async function getFiles(
  absoluteDir,
  extensions,
  ignore,
  _path = '',
  layouts = []
) {
  if (!(await fsa.exists(absoluteDir))) {
    return []
  }

  const files = await fsa.readdir(absoluteDir)

  const sortedFiles = moveToFront(files, ['_layout.svelte', '_reset.svelte'])

  const listItems = []
  for (const file of sortedFiles) {
    listItems.push(await readRoutes(file))
  }

  const list = flatten(listItems)

  // filter undefined items (underscored files)
  return list.filter(item => item)

  async function readRoutes(filename) {
    const ignored = ignore.some(ignoreStr => filename.match(ignoreStr))
    if (ignored) return

    const _filepath = path.resolve(absoluteDir + '/' + filename)
    const [noExtName, ext] = splitString(filename, '.')

    const isDir = (await fsa.stat(_filepath)).isDirectory()
    const isLayout = ['_layout', '_reset'].includes(noExtName)
    const isReset = ['_reset'].includes(noExtName)
    const isIndex = noExtName === 'index'
    const isFallback = noExtName === '_fallback'
    const hasParam = noExtName.match(/^\[.+\]$/) ? true : false
    const filepath = _path + '/' + filename

    // guard: skip underscore prefixed files that aren't layout
    if (!isLayout && !isFallback && filename.match(/^_/)) return

    if (isReset) layouts = []

    if (isLayout) layouts.push({ filepath, path: _path + '/' })

    if (isDir) {
      const nestedList = await getFiles(
        _filepath,
        extensions,
        ignore,
        filepath,
        [...layouts]
      )
      return nestedList
    }
    if (extensions.includes(ext)) {
      return { filepath, layouts, isLayout, isFallback, isIndex, hasParam }
    }
  }
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
