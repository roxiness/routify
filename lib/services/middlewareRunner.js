const { attachComponent } = require('../middleware/attachComponent')
const { applyMetaToFiles, applyMetaToTree, defineDefaultMeta } = require('../middleware/assignMeta')
const { generateFileTree } = require('../middleware/generateFileTree')
const { addPath, addId, removeUnderscoredDirs, removeNonSvelteFiles, defineFiles, filterTree, sortTree } = require('../middleware/misc')
const template = require('../middleware/createTemplate')
const { pipeAsync } = require('../utils/fp')

module.exports = async function middlewareRunner(payload) {  
  function initial(x) { Object.assign(x, payload)} //initial payload = {options, metaParser}

  return await pipeAsync(
    initial,
    generateFileTree, // => children
    removeUnderscoredDirs, // _private => false
    defineFiles, // file => ({ isLayout, isReset, isIndex, isFallback })
    removeNonSvelteFiles, // remove _file.svelte, keep dirs, layouts & resets
    defineDefaultMeta,
    applyMetaToFiles,
    applyMetaToTree,
    filterTree,
    sortTree,
    addPath, // ... => ({ path, ... })
    addId, // ... => ({ id, ... })
    attachComponent, // { component }; { path } for layouts
    template
  )
}
