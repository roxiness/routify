const fsaSingleton = require('../utils/fsa')
const { splitString } = require('../utils')
const { makeLegalIdentifier } = require('rollup-pluginutils')
const path = require('path')
const picomatch = require('picomatch')

const frontFiles = ['_layout', '_reset']
const extensions = ['svelte', 'html']

const defaultOptions = {
  bundle: false,
  recursive: true,
  'precache-order': false,
  'precache-proximity': true,
  preload: false,
}

// fsa=fsaSingleton for tests
module.exports = async function scanner({ pages, fsa = fsaSingleton, ignore }) {
  
  const tree = await getFileTree(pages, fsa, picomatch(ignore))
  const treeWithDirs = removeUnderscoredDirs(tree)
  const definedTree = defineFiles(treeWithDirs)
  const sortedTree = sortTree(definedTree)
  const treeWithOptions = await applyOptionsToFiles(sortedTree, fsa)
  const treeWithAllOptions = applyOptionsToTree(treeWithOptions)
  const svelteTree = removeNonSvelteFiles(treeWithAllOptions)
  const treeWithLayouts = applyLayouts(svelteTree)
  const list = flattenTree(treeWithLayouts)
  return list
}

/**
 * removeUnderscoredDirs
 * @param {String} tree
 */
function removeUnderscoredDirs(tree) {
  return tree.filter(file => {
    if (file.isDir) {
      if (file.name.match(/^_/)) return false
      else file.dir = removeUnderscoredDirs(file.dir)
    }
    return true
  })
}

/**
 * removeNonSvelteFiles
 * @param {String} tree
 */
function removeNonSvelteFiles(tree) {
  return tree.filter(file => {
    file.dir = removeNonSvelteFiles(file.dir)
    const isUnderscored = file.name.match(/^_/)
    const isPage = extensions.includes(file.ext) && !isUnderscored
    const isNormalDir = file.isDir && !isUnderscored
    return isPage || isNormalDir || file.isLayout || file.isFallback
  })
}

/**
 * applyLayouts
 * @param {Object} tree
 * @param {Array} layouts
 */
function applyLayouts(tree, layouts = []) {
  return tree.map(file => {
    if (file.isDir) file.dir = applyLayouts(file.dir, [...layouts])
    else {
      if (file.isReset || file.options.reset) layouts = []
      if (file.isLayout) layouts.push(file)
      else file.layouts = layouts
    }
    return file
  })
}

/**
 * flattenTree
 * @param {Object} tree
 * @param {Array} arr
 */
function flattenTree(tree, arr = []) {
  tree.forEach(file => {
    if (!file.isDir) arr.push(file)
    else arr.push(...flattenTree(file.dir))
  })
  return arr
}

/**
 * applyOptionsToFiles
 * @param {Object} tree
 * @param {Object} fsa
 * @param {Object} dirOptions
 */
async function applyOptionsToFiles(tree, dirOptions = defaultOptions) {
  const treeWithOptions = tree.map(async file => {
    file.dir = await applyOptionsToFiles(file.dir, { ...dirOptions })
    file.options = file.isDir ? {} : await getOptions(file.absolutePath)
    return file
  })
  return Promise.all(treeWithOptions)
}

function applyOptionsToTree(tree, dirOptions = defaultOptions) {
  return tree.map(file => {
    file.dir = applyOptionsToTree(file.dir, { ...dirOptions })
    mergeOptions(file, dirOptions)
    return file
  })
}

/**
 * mergeOptions
 * @param {Object} options
 * @param {Object} dirOptions
 * @param {Boolean} isLayout
 * @param {String} filepath
 */
function mergeOptions({ options, filepath, isLayout }, dirOptions) {
  const inheritedOption = [
    'preload',
    'precache-order',
    'precache-proximity',
    'recursive',
    'bundleId',
  ]

  inheritedOption.forEach(prop => {
    options[prop] = options[prop] || dirOptions[prop]
    if (isLayout) {
      dirOptions[prop] = options[prop]
    }
  })

  if (options.bundle === false) {
    delete options.bundleId
    if (!isLayout) delete dirOptions.bundleId
  } else {
    if (options.bundle === true) {
      if (!isLayout) throw Error('only layouts can bundle')
      const bundleId = makeLegalIdentifier(filepath) + '.js'
      dirOptions.bundleId = bundleId
    }
    options.bundleId = dirOptions.bundleId
  }
}

/**
 * sortTree
 * @param {Object} tree
 */
function sortTree(tree) {
  const sortedFiles = tree.sort(file => (file.isLayout ? -1 : 1))
  const sortedTree = sortedFiles.map(file => ({
    ...file,
    dir: file.isDir ? sortTree(file.dir) : file.dir,
  }))
  return sortedTree
}

/**
 * defineFiles
 * @param {Object} tree
 */
function defineFiles(tree) {
  return tree.map(file => {
    file.isLayout = frontFiles.includes(file.name)
    file.isReset = ['_reset'].includes(file.name)
    file.isIndex = ['index'].includes(file.name)
    file.isFallback = ['_fallback'].includes(file.name)
    file.hasParam = file.name.match(/^\[.+\]$/) ? true : false
    file.dir = file.isDir ? defineFiles(file.dir) : file.dir
    return file
  })
}

/**
 * getFileTree
 * @param {String} absoluteDir
 * @param {Object} fsa
 * @param {String} relativeDir
 */
async function getFileTree(absoluteDir, fsa, isIgnored, relativeDir = '') {
  const files = await fsa.readdir(absoluteDir)
  const promises = files.map(async filename => {
    const absolutePath = path.resolve(absoluteDir, filename)
    const isDir = await isDirectory(absolutePath, fsa)
    const [name, ext] = splitString(filename, ".")
    const filepath = `${relativeDir}/${filename}`

    const file = {
      file: filename,
      filepath,
      name,
      ext,
      isDir,
      relativeDir,
      absolutePath
    }

    file.dir = isAcceptedDir(file, isIgnored)
      ? await getFileTree(absolutePath, fsa, isIgnored, filepath)
      : []
    return file
  })
  return Promise.all(promises)
}

async function isDirectory(file, fsa) {
  const stat = await fsa.stat(file)
  return stat.isDirectory()
}

function isAcceptedDir({ name, isDir, filepath }, isIgnored) {
  const isUnderscored = name.match(/^_/)
  return isDir && !isUnderscored && !isIgnored(filepath)
}

/**
 * TODO
 * @param {String} filepath
 * @param {String} filename
 * @param {Array} files
 */
function getOptions(filepath, filename, files) {
  // console.log('filename', filename)
  // console.log('filepath', filepath)
  // console.log('files', files)
  return getOptionsFromComments(filepath)
}

/**
 * getOptionsFromComments
 * @param {String} file
 */
async function getOptionsFromComments(file) {
  const options = {}
  const content = await fsaSingleton.readFile(file, 'utf8')
  const matchedContent = content.match(
    /\<\!\-\- *routify:option *(.+?) *\-\-\>/m
  )
  if (matchedContent) {
    const rawOptions = matchedContent[1].match(/[^ ]+=[^ ]+/g)
    rawOptions.forEach(rawOption => {
      const [prop, value] = rawOption.match(/(.+)=(.+)/).slice(1)
      options[prop] = eval(value)
    })
  }
  return options
}
