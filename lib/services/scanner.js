const { makeLegalIdentifier } = require('rollup-pluginutils')
const path = require('path')
const picomatch = require('picomatch')
const fsa = require('../utils/fsa')
const { filepathToUrl } = require('../utils')

const frontFiles = ['_layout', '_reset']

const defaultMeta = {
  bundle: false,
  recursive: true,
  'precache-order': false,
  'precache-proximity': true,
  preload: false,
}

const nope = () => false

module.exports = async function scanner(options) {
  const root = { meta: { untouched: true }, root: true }
  const { ignore, pages } = options
  let { extensions } = options
  extensions = Array.isArray(extensions) ? extensions : extensions.split(',')

  const isIgnored = ignore ? picomatch(ignore) : nope
  const tree = await getFileTree(pages, isIgnored, '', extensions)
  const treeWithDirs = removeUnderscoredDirs(tree)
  const definedTree = defineFiles(treeWithDirs)
  const sortedTree = sortTree(definedTree)
  const treeWithMeta = await applyMetaToFiles(sortedTree, root)


  const treeWithAllMeta = applyMetaToTree(treeWithMeta, defaultMeta)
  const svelteTree = removeNonSvelteFiles(treeWithAllMeta)
  const decoratedTree = decorate(svelteTree)
  const treeWithComponents = attachComponent(decoratedTree, options)

  return { dir: treeWithComponents, ...root }
}

function attachComponent(tree, options) {
  const { dynamicImports, pages, routifyDir } = options
  return tree.map(file => {
    if (file.dir)
      file.dir = attachComponent(file.dir, options)
    else {
      const { $$bundleId } = file.meta
      let component
      if (dynamicImports && !file.meta.$preload) {
        if ($$bundleId)
          component = `'''() => import('${process.cwd() + '/' + routifyDir}/${$$bundleId}').then(m => m.${file.id})'''`
        else
          component = `'''() => import('${pages}${file.filepath}').then(m => m.default)'''`
      } else component = `'''() => ${file.id}'''`
      file.component = component
    }
    file.path = file.isLayout ? file.relativeDir : file.path
    return file
  })
}

function decorate(tree) {
  return tree.map(file => {
    file.path = filepathToUrl(file.filepath, file.ext)
    if (file.dir) {
      file.dir = decorate(file.dir)
    } else {
      file.id = makeLegalIdentifier(file.path)
    }
    return file
  })
}

/**
 * removeUnderscoredDirs
 * @param {String} tree
 */
function removeUnderscoredDirs(tree) {
  return tree.filter(file => {
    if (file.dir) {
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
    if (file.dir)
      file.dir = removeNonSvelteFiles(file.dir)
    const isUnderscored = file.name.match(/^_/)
    const isPage = !file.badExt && !isUnderscored
    const isNormalDir = file.dir && !isUnderscored
    return isPage || isNormalDir || file.isLayout || file.isFallback
  })
}



/**
 * applyMetaToFiles
 * @param {Object} tree
 * @param {Object} dirMeta
 */
async function applyMetaToFiles(tree, parent) {
  const treeWithMeta = tree.map(async file => {
    if (file.dir)
      file.dir = await applyMetaToFiles(file.dir, file)
    else {
      const meta = await getMeta(file.absolutePath)
      file.meta = meta
      if (file.isLayout) { parent.meta = meta }
    }
    return file
  })
  return Promise.all(treeWithMeta)
}

function applyMetaToTree(tree, dirMeta) {

  return tree.map(file => {
    file.meta = mergeMeta(file, dirMeta)

    if (file.dir)
      file.dir = applyMetaToTree(file.dir, file.meta)
    return file
  })
}

/**
 * mergeMeta
 * @param {Object} meta
 * @param {Object} dirMeta
 * @param {Boolean} isLayout
 * @param {String} filepath
 */
function mergeMeta({ meta = {}, filepath, isLayout, dir }, { ...dirMeta }) {
  const inheritedOption = [
    '$preload',
    '$precache-order',
    '$precache-proximity',
    '$recursive',
    '$$bundleId',
  ]

  inheritedOption.forEach(prop => {
    meta[prop] = meta[prop] || dirMeta[prop]
    // if (isLayout) {
    //   dirMeta[prop] = meta[prop]
    // }
  })

  // ignore layout bundles, as they're passed to the parent folder
  if (!isLayout)
    if (meta.$bundle === false) {
      delete meta.$$bundleId
      if (dir) delete dirMeta.$$bundleId
    } else if (meta.$bundle === true) {
      {
        if (!dir) throw Error('bundling can not be enabled in individual files')
        dirMeta.$$bundleId = makeLegalIdentifier(filepath) + '.js'
      }
      meta.$$bundleId = dirMeta.$$bundleId
    }

  return meta
}

/**
 * sortTree
 * @param {Object} tree
 */
function sortTree(tree) {
  const sortedFiles = tree.sort(file => (file.isLayout ? -1 : 1))
  const sortedTree = sortedFiles.map(file => {
    if (file.dir)
      file.dir = sortTree(file.dir)
    return file
  })
  return sortedTree
}

/**
 * defineFiles
 * @param {Object} tree
 */
function defineFiles(tree) {
  return tree.map(file => {
    if (file.dir) {
      file.dir = defineFiles(file.dir)
    } else {
      if (!file.badExt) {
        file.isLayout = frontFiles.includes(file.name)
        file.isReset = ['_reset'].includes(file.name)
        file.isIndex = ['index'].includes(file.name)
        file.isFallback = ['_fallback'].includes(file.name)
        file.hasParam = file.name.match(/^\[.+\]$/) ? true : false
      }
    }
    return file
  })
}

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

/**
 * getFileTree
 * @param {String} absoluteDir
 * @param {Boolean} isIgnored
 * @param {String} relativeDir
 * @param {String} extensions used for mutlipart extensions like .page.svelte
 */
async function getFileTree(
  absoluteDir,
  isIgnored,
  relativeDir = '',
  extensions
) {
  const files = await fsa.readdir(absoluteDir)
  const promises = files.map(async filename => {
    const absolutePath = path.resolve(absoluteDir, filename)
    const isDir = await isDirectory(absolutePath, fsa)
    const [name, ext, badExt] = isDir ?
      [filename, '', false]
      : matchExtension(extensions, filename)
    const filepath = `${relativeDir}/${filename}`

    const file = {
      file: filename,
      filepath,
      name,
      ext,
      badExt,
      relativeDir,
      absolutePath,
    }

    if (isDir)
      file.dir = isAcceptedDir(file, isDir, isIgnored)
        ? await getFileTree(absolutePath, isIgnored, filepath, extensions)
        : []
    return file
  })
  return Promise.all(promises)
}

async function isDirectory(file, fsa) {
  const stat = await fsa.stat(file)
  return stat.isDirectory()
}

function isAcceptedDir({ name, filepath }, isDir, isIgnored) {
  const isUnderscored = name.match(/^_/)
  return isDir && !isUnderscored && !isIgnored(filepath)
}

/**
 * getMeta
 * @param {String} filepath
 * @param {Object} fsa
 */
function getMeta(filepath, fsa) {
  return getMetaFromComments(filepath, fsa)
}

/**
 * getMetaFromComments
 * @param {String} file
 */
async function getMetaFromComments(file) {
  const meta = {}
  const content = await fsa.readFile(file, 'utf8')
  const matchedContent = content.match(
    /\<\!\-\- *routify:options +((.|[\r\n])+?) *\-\-\>/m
  )
  if (matchedContent) {
    const [, prop, value] = matchedContent[1].match(/(.+) *= *((.|[\r\n])+)/m)
    meta[prop] = eval(`(${value})`)
  }
  return meta
}
