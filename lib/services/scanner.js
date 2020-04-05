const { attachComponent } = require('./flow/attachComponent')
const { applyMetaToFiles, applyMetaToTree } = require('./flow/assignMeta')
const { generateFileTree } = require('./flow/generateFileTree')
const { addPath, addId, removeUnderscoredDirs, removeNonSvelteFiles, defineFiles } = require('./flow/basic')
const template = require('./flow/createTemplate')

const {
  pipeAsync,
  walkAsync,
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

module.exports = async function scanner(inputOptions, metaParser) {
  const options = parseOptions({ ...defaultOptions, ...inputOptions })

  return await pipeAsync(
    x => {
      x.options = options;
      x.metaParser = metaParser;
      x.defaultMeta = defaultMeta;
      x.tree = { meta: { untouched: true }, root: true, dir: [] }
    },
    // createRoot, // dir => ({ dir, ...root })
    generateFileTree, // => dir
    removeUnderscoredDirs, // _private => false
    defineFiles, // file => ({ isLayout, isReset, isIndex, isFallback })
    removeNonSvelteFiles, // remove _file.svelte, keep dirs, layouts & resets
    applyMetaToFiles,
    applyMetaToTree,
    addPath, // ... => ({ path, ... })
    addId, // ... => ({ id, ... })
    attachComponent, // { component }; { path } for layouts
    template
  )
}







Object.assign(module.exports, { walkAsync })
