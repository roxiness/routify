const log = require('../utils/log')
const CheapWatch = require('cheap-watch')
const path = require('path')
const fs = require('fs')

const prefixDot = s => (s.substr(0, 1) === '.' ? s : `.${s}`)

const parseExtensions = source =>
  Array.isArray(source)
    ? source.map(prefixDot)
    : source
      .split(',')
      .map(s => s.trim())
      .map(prefixDot)

const Deferred = () => {
  let resolve
  let reject
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })
  return { promise, resolve, reject }
}

// must resolve when the initial routes have been generated (aka system ready)
module.exports = function monitor(options, cache, callback) {
  const {
    pages: dir,
    extensions: extensionsOption,
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
  // change event is needed for rollup plugin
  let changeDeferred = Deferred()
  // dedup multiple calls to generate while busy
  let scheduled = false

  const generate = async event => {
    log.debug(`Changed: ${event.path}`)
    // guard: already scheduled
    if (scheduled) return
    try {
      scheduled = true
      // waitChange must defer until idlePromise is current (which is now)
      //@ts-ignore
      changeDeferred.resolve()
      await idlePromise
      idlePromise = callback(event)
      await idlePromise
      // until this point, we don't need to block waiting for change, because
      // idlePromise will wait all what is needed, so we leave the resolved
      // changeDeferred.promise until here
      changeDeferred = Deferred()
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

  const resolvePath = filename => path.resolve(dir, filename)

  watch.on(
    '+',
    ifIsRoute(event => {
      if (event.isNew) {
        return generate(event)
      }
      cache
        .hasMetaChanged(resolvePath(event.path))
        .then(changed => {
          if (!changed) return
          log('meta data changed')
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
      cache.deleteFile(resolvePath(event.path))
      generate(event).catch(err => {
        log.error('Failed to generate route files', err)
      })
    })
  )

  watch.init().catch(err => {
    log.error('Failed to watch pages directory', err)
  })

  watch.waitChange = async () => await changeDeferred.promise

  watch.waitIdle = async () => await idlePromise

  return watch
}
