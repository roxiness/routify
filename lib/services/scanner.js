const { attachComponent } = require('./flow/attachComponent')
const { applyMetaToFiles, applyMetaToTree } = require('./flow/assignMeta')
const { generateFileTree } = require('./flow/generateFileTree')
const { addPath, addId, removeUnderscoredDirs, removeNonSvelteFiles, defineFiles } = require('./flow/misc')
const template = require('./flow/createTemplate')

const {
  pipeAsync,
  walkAsync,
} = require('../utils/fp')


const defaultMeta = {
  bundle: false,
  recursive: true,
  'precache-order': false,
  'precache-proximity': true,
  preload: false,
}

function normalizeOptions({ options }) {
  const { extensions } = options
  options.extensions = Array.isArray(extensions) ? extensions : extensions.split(',')
}

module.exports = async function scanner(options, metaParser) {  
  return await pipeAsync(
    x => {
      x.options = options;
      x.metaParser = metaParser;
      x.defaultMeta = defaultMeta;
      x.tree = { meta: { untouched: true }, root: true, dir: [] }
    },
    // createRoot, // dir => ({ dir, ...root })
    normalizeOptions,
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
