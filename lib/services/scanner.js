const { attachComponent } = require('./flow/attachComponent')
const { applyMetaToFiles, applyMetaToTree, defineDefaultMeta } = require('./flow/assignMeta')
const { generateFileTree } = require('./flow/generateFileTree')
const { addPath, addId, removeUnderscoredDirs, removeNonSvelteFiles, defineFiles, normalizeOptions } = require('./flow/misc')
const template = require('./flow/createTemplate')
const { pipeAsync } = require('../utils/fp')

module.exports = async function scanner(options, metaParser) {
  return await pipeAsync(
    x => {
      x.options = options;
      x.metaParser = metaParser;
      x.tree = { meta: { untouched: true }, root: true, dir: [] }
    },
    normalizeOptions,
    generateFileTree, // => dir
    removeUnderscoredDirs, // _private => false
    defineFiles, // file => ({ isLayout, isReset, isIndex, isFallback })
    removeNonSvelteFiles, // remove _file.svelte, keep dirs, layouts & resets
    defineDefaultMeta,
    applyMetaToFiles,
    applyMetaToTree,
    addPath, // ... => ({ path, ... })
    addId, // ... => ({ id, ... })
    attachComponent, // { component }; { path } for layouts
    template
  )
}
