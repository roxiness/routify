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
        const assignment = fragments[1]
        const isFlag = !assignment.match('=')
        const [, prop, value] = isFlag ?
          [null, assignment, true] :
          assignment.match(/(.+) *= *((.|[\r\n])+)/m)
        try {
          meta[prop] = JSON.parse(value)
        } catch (err) {
          log.warn(
            `${assignment} value is not valid JSON` +
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

  async function fileChange(file) {
    if (!useCache) return 'uncached'

    const oldMetaStr = cache.get(file)

    if (!oldMetaStr) return 'new'

    const newMetaStr = JSON.stringify(await get(file))
    return oldMetaStr !== newMetaStr ? 'changed' : 'unchanged'
  }

  return { get, fileChange, deleteFile }
}
