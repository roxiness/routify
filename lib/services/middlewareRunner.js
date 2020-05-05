const { attachComponent } = require('../middleware/attachComponent')
const { applyMetaToFiles, applyMetaToTree, defineDefaultMeta } = require('../middleware/assignMeta')
const { generateFileTree } = require('../middleware/generateFileTree')
const { addPath, addId, removeUnderscoredDirs, removeNonSvelteFiles, defineFiles } = require('../middleware/misc')
const template = require('../middleware/createTemplate')
const { pipeAsync } = require('../utils/fp')

// @ts-check

/**
 * @param {TreePayload} payload
 * @returns
 */
module.exports = async function middlewareRunner(payload) {
  // console.log(payload.options)

  function initial(x) { Object.assign(x, payload) } //initial payload = {options, metaParser}

  const _middlewares = {
    initial,
    generateFileTree, // => children
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
  }

  const middlewares = Object.entries(_middlewares)
    .map(([name, middleware]) => ({ name, middleware }))


  // applyExtensions(payload, middlewares)

  return await pipeAsync(...Object.values(middlewares))
}



async function applyExtensions(payload = [], middlewares) {
  const plugins = payload || []
  // plugins.unshift(eventServer)
  // for (plugin of plugins)
  //   await plugin(middlewares, payload)
}