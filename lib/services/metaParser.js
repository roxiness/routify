/**
 * Meta parser
 *
 * A new build will be triggered only if one of the following condition is met:
 *
 * - a (page) file has been deleted
 * - a new (page) file has been added
 * - an existing (page) file meta have changed
 */

const fsa = require('../utils/fsa')
const log = require('../utils/log')

const cache = new Map()

// @ts-ignore
module.exports = ({ cache: useCache } = {}) => {
  async function get(file) {
    const content = await fsa.readFile(file, 'utf8')
    const meta = {}
    const re = RegExp(/\<\!\-\- *routify:options +((.|[\r\n])+?) *\-\-\>/, 'g')
    let fragments
    while ((fragments = re.exec(content))) {
      if (fragments) {
        const [, prop, value] = fragments[1].match(/(.+) *= *((.|[\r\n])+)/m)
        try {
          meta[prop] = eval(`(${value})`)
        } catch (err) {
          log.warn(
            `${fragments[1]} can not be evaluated as a javascript expression` +
              ` in ${file} (${err.toString()})`
          )
        }
      }
    }
    if (useCache) cache.set(file, JSON.stringify(meta))
    return meta
  }

  function deleteFile(file) {
    return (useCache && cache.delete(file)) || true
  }

  async function hasMetaChanged(file) {
    if (!useCache) return true

    const oldMetaStr = cache.get(file) || '{}'
    const newMetaStr = JSON.stringify(await get(file))
    return oldMetaStr !== newMetaStr
  }

  return { get, hasMetaChanged, deleteFile }
}
