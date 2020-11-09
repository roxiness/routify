const { attachComponent } = require('../middleware/attachComponent')
const { applyMetaToFiles, applyMetaToTree } = require('../middleware/assignMeta')
const { generateFileTree } = require('../middleware/generateFileTree')
const { addPath, addId, removeUnderscoredDirs, removeNonSvelteFiles, defineFiles } = require('../middleware/misc')
const template = require('../middleware/createTemplate')
const { pipeAsync } = require('../utils/fp')
const log = require('../utils/log')
const createBundles = require('../middleware/createBundles')
const writeUrlIndex = require('../middleware/writeUrlIndex')
const defaultSort = require('../middleware/defaultSort')
// @ts-check

/**
 * @param {TreePayload} payload
 * @returns
 */
module.exports = async function middlewareRunner(payload) {
  function initial(x) { Object.assign(x, payload) } //initial payload = {options, metaParser}

  const _middlewares = {
    initial,
    generateFileTree, // => children
    removeUnderscoredDirs, // _private => false
    defineFiles, // file => ({ isLayout, isReset, isIndex, isFallback })
    removeNonSvelteFiles, // remove _file.svelte, keep dirs, layouts & resets
    applyMetaToFiles,
    applyMetaToTree,
    addPath, // ... => ({ path, ... })
    addId, // ... => ({ id, ... })
    defaultSort,
    attachComponent, // { component }; { path } for layouts
    template,
    createBundles,
    writeUrlIndex
  }

  let middlewares = Object.entries(_middlewares)
    .map(([name, middleware]) => ({ name, middleware }))


  middlewares = await applyExtensions(payload, middlewares)

  return await pipeAsync(...Object.values(middlewares))
}



async function applyExtensions(payload = [], middlewares) {
  const plugins = payload.options.plugins || {}
  

  for (const plugin of Object.entries(plugins)) {
    const [name, config] = plugin
    const pluginFn = resolveExtension(name)
    if (!pluginFn) { log.error(`did not find the extension ${name}`); process.exit(); }
    middlewares = await pluginFn(middlewares, payload, config)
  }
  return middlewares
}

function resolveExtension(name) {
  const { resolve, dirname } = require('path')
  const modulePath = () => require.resolve(name, { paths: [process.cwd()] })
  const plainPath = () => name

  for (const path of [modulePath, plainPath]) {
    try {
      return require(path())
    } catch (err) {
    }
  }
}