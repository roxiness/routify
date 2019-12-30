const log = require('./log')
const CheapWatch = require('cheap-watch')
const path = require('path')
const fs = require('fs')

const extensions = ['.svelte', '.html']

// must resolve when the initial routes have been generated (aka system ready)
module.exports = function monitor(options, callback) {
  const { pages: dir } = options
  const watchWhiteList = /^_(?:layout|reset|fallback)\./

  // ensure write directory exists
  if (!fs.existsSync(dir)){
    log.error('Pages folder does not exist: ' + dir)
    process.exit()
  }
  
  log('Watching', dir)

  const watch = new CheapWatch({ dir })

  // run generate in series
  let idlePromise
  // dedup multiple calls to generate while busy
  let scheduled = false

  const generate = async event => {
    log.debug(`Changed: ${event.path}`)
    // guard: already scheduled
    if (scheduled) return
    try {
      scheduled = true
      await idlePromise
      idlePromise = callback(event)
      await idlePromise
    } finally {
      scheduled = false
    }
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

  watch.waitIdle = async () => await idlePromise

  return watch
}
