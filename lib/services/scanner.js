const { makeLegalIdentifier } = require('rollup-pluginutils')
const path = require('path')
const picomatch = require('picomatch')
const fsa = require('../utils/fsa')
const {
  identity,
  nope,
  pipeAsync,
  filter,
  filterAsync,
  someAsync,
  mapAsync,
} = require('../utils/fp')

const frontFiles = ['_layout', '_reset']

const defaultOptions = {}

const defaultMeta = {
  bundle: false,
  recursive: true,
  'precache-order': false,
  'precache-proximity': true,
  preload: false,
}

const parseOptionExtensions = ({ extensions }) => ({
  extensions: Array.isArray(extensions) ? extensions : extensions.split(','),
})

const parseOptions = options => ({
  ...options,
  ...parseOptionExtensions(options),
})

const createRoot = dir => ({ meta: { untouched: true }, root: true, dir })

module.exports = async function scanner(inputOptions, metaParser) {
  const options = parseOptions({ ...defaultOptions, ...inputOptions })

  const { pages, hooks = {} } = options

  const buildTree = pipeAsync(
    getFilesTree(options), // => dir
    createRoot, // dir => ({ dir, ...root })
    // NOTE "walkers" will be called for each file (not the whole tree)
    walkAsync(
      hooks.readTree, // file => void|false
      removeUnderscoredDirs, // _private => false
      defineFiles, // file => ({ isLayout, isReset, isIndex, isFallback })
      removeNonSvelteFiles, // remove _file.svelte, keep dirs, layouts & resets
      // TODO sortTree became useless apparently -- keeping it a little longer
      // ), sortTree, walkAsync(
      applyMetaToFiles({ metaParser }),
      applyMetaToTree(defaultMeta),
      addPath, // ... => ({ path, ... })
      hooks.decorate,
      addId, // ... => ({ id, ... })
      attachComponent(options) // { component }; { path } for layouts
    )
  )

  return await buildTree(pages)
}

const attachComponent = ({ dynamicImports, pages, routifyDir }) => file => {
  if (!file.dir) {
    const { $$bundleId } = file.meta
    let component
    if (dynamicImports && !file.meta.preload) {
      if ($$bundleId) {
        component = `'''() => import('${process.cwd() +
          '/'}${routifyDir}/${$$bundleId}').then(m => m.${file.id})'''`
      } else {
        component = `'''() => import('${pages}${file.filepath}').then(m => m.default)'''`
      }
    } else {
      component = `'''() => ${file.id}'''`
    }
    file.component = component
  }
  if (file.isLayout) {
    file.path = path.posix.dirname(file.path)
  }
  return file
}

/**
 * walkAsync = (...walkers: file => {}) => (tree => tree)
 *
 * Special tree walker for the scanner, with plugin support in mind.
 *
 *       cosnt tree = await walkAsync(
 *         file => !file.isDir, // false returns exclude the file
 *         condition && walkerX, // falsy values are ignored
 *         ...
 *       )(inputTree)
 *
 * - each "walker" will be called with each file in the tree (except if some
 *   file are excluded before they reac this walker)
 *
 * - multiple walkers can be specified: they will all be run sequentially on
 *   each file (except if one returns `false`, thereby excluding the file and
 *   stopping processing)
 *
 * - the return value of the walkers is ignored, except for `false`; the walkers
 *   must mutate the file object they are passed for side effects
 *
 * - walkers can be async
 *
 * - falsy values (instead of expected function) are filtered out of the
 *   walkers array
 *
 * - if a walker returns `false`, then the file whill be filtered out
 *
 * - all the files in a dir are processed in parallel
 *
 * - the child dir of a file is always processed after the parent file
 */
function walkAsync(...walkers) {
  const actualWalkers = [].concat(...walkers).filter(Boolean)

  if (actualWalkers.length < 1) return identity

  const _walk = parent => {
    return filterAsync(async item => {
      const excluded = await someAsync(async walker => {
        const result = await walker(item, parent)
        return result === false
      }, actualWalkers)
      if (excluded) return false
      if (item.dir && item.dir.length > 0) {
        item.dir = await _walk(item)
      }
      return true
    }, parent.dir)
  }

  const walkTree = async tree => {
    tree.dir = await _walk(tree)
    return tree
  }

  return walkTree
}

function addPath(file) {
  let path = file.filepath
  if (file.ext) {
    path = path.slice(0, -(file.ext.length + 1))
  }
  path = path.replace(/\[([^\]]+)\]/g, ':$1')
  file.path = path
}

function addId(file) {
  if (!file.dir) {
    file.id = makeLegalIdentifier(file.path)
  }
}

const removeUnderscoredDirs = file => (file.dir ? !file.name.match(/^_/) : true)

const removeNonSvelteFiles = file => {
  const isUnderscored = file.name.match(/^_/)
  const isPage = !file.badExt && !isUnderscored
  const isNormalDir = file.dir && !isUnderscored
  return isPage || isNormalDir || file.isLayout || file.isFallback
}

const applyMetaToFiles = ({ metaParser: parser }) => async (file, parent) => {
  if (file.dir) return
  const meta = await parser.get(file.absolutePath)
  file.meta = meta
  if (file.isLayout) {
    parent.meta = meta
  }
}

const applyMetaToTree = defaults => file => {
  file.meta = mergeMeta(file, defaults)
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
    'preload',
    'precache-order',
    'precache-proximity',
    'recursive',
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
    if (meta.bundle === false) {
      delete meta.$$bundleId
      if (dir) delete dirMeta.$$bundleId
    } else if (meta.bundle === true) {
      {
        if (!dir) throw Error('bundling can not be enabled in individual files')
        dirMeta.$$bundleId = makeLegalIdentifier(filepath) + '.js'
      }
      meta.$$bundleId = dirMeta.$$bundleId
    }

  return meta
}

// TODO became useless apparently... let's keep it just a little longer
/**
 * sortTree
 * @param {Object} tree
 */
function sortTree(tree) {
  tree.dir = tree.dir.map(file => {
    if (file.dir) sortTree(file)
    return file
  })
  tree.dir.sort(file => (file.isLayout ? -1 : 1))
  return tree
}

const defineFiles = file => {
  if (file.badExt) return
  file.isLayout = frontFiles.includes(file.name)
  file.isReset = ['_reset'].includes(file.name)
  file.isIndex = ['index'].includes(file.name)
  file.isFallback = ['_fallback'].includes(file.name)
  file.hasParam = file.name.match(/^\[.+\]$/) ? true : false
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

const getFilesTree = ({ ignore, extensions }) => {
  const isIgnored = ignore ? picomatch(ignore) : nope

  const getSubtree = (absoluteDir, relativeDir = '') =>
    fsa
      .readdir(absoluteDir)
      .then(
        mapAsync(async filename => {
          const absolutePath = path.resolve(absoluteDir, filename)
          const isDir = await isDirectory(absolutePath, fsa)
          const [name, ext, badExt] = isDir
            ? [filename, '', false]
            : matchExtension(extensions, filename)
          const filepath = `${relativeDir}/${filename}`

          if (badExt) return false

          const file = {
            file: filename,
            filepath,
            name,
            ext,
            badExt,
            absolutePath,
          }

          if (isDir) {
            file.dir = isAcceptedDir(file, isDir, isIgnored)
              ? await getSubtree(absolutePath, filepath)
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

function isAcceptedDir({ name, filepath }, isDir, isIgnored) {
  const isUnderscored = name.match(/^_/)
  return isDir && !isUnderscored && !isIgnored(filepath)
}

Object.assign(module.exports, { walkAsync })
