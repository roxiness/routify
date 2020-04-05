const { attachComponent } = require('../middleware/attachComponent')
const { applyMetaToFiles, applyMetaToTree, defineDefaultMeta } = require('../middleware/assignMeta')
const { generateFileTree } = require('../middleware/generateFileTree')
const { addPath, addId, removeUnderscoredDirs, removeNonSvelteFiles, defineFiles, normalizeOptions } = require('../middleware/misc')
const template = require('../middleware/createTemplate')
const { pipeAsync } = require('../utils/fp')

module.exports = async function middlewareRunner(payload) {
  
  const { options, metaParser } = payload

  return await pipeAsync(
    x => Object.assign(x, { options, metaParser }),
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
