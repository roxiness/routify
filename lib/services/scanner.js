const fsaSingleton = require('../utils/fsa')
const { splitString, flatten } = require('../utils')
const path = require('path')
const { makeLegalIdentifier } = require('rollup-pluginutils')
const defaultOptions = {
  'bundle': false,
  'recursive': true,
  'precache-order': false,
  'precache-proximity': true,
  'preload': false
}

module.exports = async function analyser({
  pages,
  ignore = [],
  fsa = fsaSingleton, // for tests
}) {
  const ignoreArr = Array.isArray(ignore) ? ignore : [ignore]
  const extensions = ['html', 'svelte']
  return await getFiles(fsa, pages, extensions, ignoreArr)
}

/**
 * returns {
 *   filepath: '/path/to/file.svelte',
 *   layouts: []Object,
 *   isLayout: bool,
 *   isFallback: bool,
 *   isIndex: bool,
 *   hasParam: bool,
 *   options: Object,
 */
async function getFiles(
  fsa,
  absoluteDir,
  extensions,
  ignore,
  parentPath = '',
  layouts = [],
  dirOptions = defaultOptions
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
  return list.filter(Boolean)

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
    const filepath = parentPath + '/' + filename
    const options = isDir ? {} : await getOptionsFromComments(_filepath)
    mergeOptions(options, dirOptions, isLayout, filepath)

    // guard: skip underscore prefixed files that aren't layout
    if (!isLayout && !isFallback && filename.match(/^_/)) return

    if (isReset) layouts = []

    if (isLayout) layouts.push({ filepath, path: parentPath + '/', options })

    if (isDir) {
      const nestedList = await getFiles(
        fsa,
        _filepath,
        extensions,
        ignore,
        filepath,
        [...layouts],
        JSON.parse(JSON.stringify(dirOptions))
      )
      return nestedList
    }
    if (extensions.includes(ext)) {
      return { filepath, layouts, isLayout, isFallback, isIndex, hasParam, options }
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

function mergeOptions(options, dirOptions, isLayout, filepath) {
  const inheritedOption = ['preload', 'precache-order', 'precache-proximity', 'recursive', 'bundleId']

  inheritedOption.forEach(prop => {
    options[prop] = options[prop] || dirOptions[prop]
    if (isLayout) {
      dirOptions[prop] = options[prop]
    }
  })

  if (options.bundle) {
    if (!isLayout) throw Error('only layouts and resets can bundle')
    const bundleId = makeLegalIdentifier(filepath) + ".js"
    dirOptions.bundleId = bundleId
    options.bundleId = bundleId
  }
}

async function getOptionsFromComments(file) {
  const options = {}
  const content = await fsaSingleton.readFile(file, "utf8")
  const matchedContent = content.match(/\<\!\-\- *ROUTIFY:option *(.+?) *\-\-\>/m)
  if (matchedContent) {
    const rawOptions = matchedContent[1].match(/[^ ]+=[^ ]+/g)
    rawOptions.forEach(rawOption => {
      const [prop, value] = rawOption.match(/(.+)=(.+)/).slice(1)
      options[prop] = eval(value)
    })
  }
  return options
}