const { attachComponent } = require('./middleware/attachComponent')
const { applyMetaToFiles, applyMetaToTree } = require('./middleware/assignMeta')
const { generateFileTree } = require('./middleware/generateFileTree')
const { addPath, addId, removeUnderscoredDirs, removeNonSvelteFiles, sortTree, defineFiles } = require('./middleware/basic')


const {
  pipeAsync,
  walkAsync,
  identity,
} = require('../utils/fp')



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

function createRoot(dir) { return { meta: { untouched: true }, root: true, dir } }

module.exports = async function scanner(inputOptions, metaParser) {
  const options = parseOptions({ ...defaultOptions, ...inputOptions })

  const { pages, hooks = {} } = options

  const buildTree = pipeAsync(
    generateFileTree(options), // => dir
    createRoot, // dir => ({ dir, ...root })
    walkAsync(hooks.file),
    hooks.tree || identity,
    removeUnderscoredDirs, // _private => false
    defineFiles, // file => ({ isLayout, isReset, isIndex, isFallback })
    removeNonSvelteFiles, // remove _file.svelte, keep dirs, layouts & resets
    applyMetaToFiles({ metaParser }),
    applyMetaToTree(defaultMeta),
    addPath, // ... => ({ path, ... })
    walkAsync(hooks.decorate),
    addId, // ... => ({ id, ... })
    // TODO sortTree became useless apparently -- keeping it a little longer
    // sortTree, 
    // NOTE "walkers" will be called for each file (not the whole tree)
    walkAsync(
      attachComponent(options), // { component }; { path } for layouts
      hooks.finalize,
    )
  )

  return await buildTree(pages)
}







Object.assign(module.exports, { walkAsync })
