const log = require('./log')
const CheapWatch = require('cheap-watch')
const path = require('path')
const fs = require('fs')

const defaultExtensions = ['.svelte', '.html']

const prefixDot = s => (s.substr(0, 1) === '.' ? s : `.${s}`)

const parseExtensions = source =>
  Array.isArray(source)
    ? source.map(prefixDot)
    : source
        .split(',')
        .map(s => s.trim())
        .map(prefixDot)

// must resolve when the initial routes have been generated (aka system ready)
module.exports = function monitor(options, cache, callback) {
  const {
    pages: dir,
    extensions: extensionsOption = defaultExtensions,
  } = options
  const extensions = parseExtensions(extensionsOption)
  const watchWhiteList = /^_(?:layout|reset|fallback)\./

  // ensure write directory exists
  if (!fs.existsSync(dir)) {
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

  const isExtension = name =>
    extensions.some(ext => name.slice(-ext.length) === ext)

  const ifIsRoute = fn => event => {
    const { path: p, stats } = event
    if (stats.isDirectory()) return
    if (!isExtension(p)) return
    const basename = path.basename(p)
    const priv = basename.substr(0, 1) === '_'
    if (priv && !watchWhiteList.test(basename)) return
    return fn(event)
  }

  watch.on(
    '+',
    ifIsRoute(event => {
      cache
        .refreshFile(path.resolve(dir, event.path))
        .then(changed => {
          if (!changed) return
          return generate(event)
        })
        .catch(err => {
          log.error('Failed to generate route files', err)
        })
    })
  )

  watch.on(
    '-',
    ifIsRoute(event => {
      cache.deleteFile(path.resolve(dir, event.path))
      generate(event).catch(err => {
        log.error('Failed to generate route files', err)
      })
    })
  )

  watch.init().catch(err => {
    log.error('Failed to watch pages directory', err)
  })

  watch.waitIdle = async () => await idlePromise

  return watch
}
