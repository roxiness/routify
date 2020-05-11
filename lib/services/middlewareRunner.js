const { attachComponent } = require('../middleware/attachComponent')
const { applyMetaToFiles, applyMetaToTree, defineDefaultMeta } = require('../middleware/assignMeta')
const { generateFileTree } = require('../middleware/generateFileTree')
const { addPath, addId, removeUnderscoredDirs, removeNonSvelteFiles, defineFiles } = require('../middleware/misc')
const template = require('../middleware/createTemplate')
const { pipeAsync } = require('../utils/fp')
const log = require('../utils/log')
const createBundles = require('../middleware/createBundles')

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
    defineDefaultMeta,
    applyMetaToFiles,
    applyMetaToTree,
    addPath, // ... => ({ path, ... })
    addId, // ... => ({ id, ... })
    attachComponent, // { component }; { path } for layouts
    template,
    createBundles
  }

  let middlewares = Object.entries(_middlewares)
    .map(([name, middleware]) => ({ name, middleware }))


  middlewares = await applyExtensions(payload, middlewares)

  return await pipeAsync(...Object.values(middlewares))
}



async function applyExtensions(payload = [], middlewares) {
  const plugins = payload.options.plugins || []

  for (plugin of plugins) {
    const [name, config] = Object.entries(plugin)[0]
    const pluginFn = resolveExtension(name)
    if (!pluginFn) { log.error(`did not find the extension ${name}`); process.exit(); }
    middlewares = await pluginFn(middlewares, payload, config)
  }
  return middlewares
}

function resolveExtension(name) {
  const { resolve } = require('path')
  const cwdPath = resolve(process.cwd(), name)
  const localPath = resolve(__dirname, '../extensions', name)
  const cwdModule = resolve(process.cwd(), 'node_modules', name)

  for (path of [cwdPath, localPath, cwdModule, name]) {
    try {
      return require(path)
    } catch (err) {
      if (!err.message.startsWith(`Cannot find module '${path}'`))
        throw (err)
    }
  }
}