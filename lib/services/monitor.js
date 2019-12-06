const log = require('./log')
const CheapWatch = require('cheap-watch')
const path = require('path')

const extensions = ['.svelte', '.html']

// must resolve when the initial routes have been generated (aka system ready)
module.exports = async function monitor(options, callback) {
  const { pages: dir } = options

  log('Watching', dir)

  const watch = new CheapWatch({ dir })

  let idlePromise

  const generate = async event => {
    await idlePromise
    idlePromise = callback(event)
  }

  const safeGenerate = event =>
    generate(event).catch(err => {
      log.error('Failed to generate route files', err)
    })

  const ifIsRoute = fn => event => {
    const { path: p, stats } = event
    if (stats.isDirectory()) return
    if (!extensions.includes(path.extname(p))) return
    const basename = path.basename(p)
    const priv = basename.substr(0, 1) === '_'
    if (priv && !watchWhiteList.test(basename)) return
    return fn(event)
  }

  const maybeRegenerate = ifIsRoute(safeGenerate)

  const ifIsNew = fn => x => x.isNew && fn(x)

  watch.on('+', ifIsNew(maybeRegenerate))

  watch.on('-', maybeRegenerate)

  watch.init().catch(err => {
    log.error('Failed to watch pages directory', err)
  })

  await safeGenerate()
}
