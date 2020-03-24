/**
 * Meta parser
 *
 * During watch, doubles as a build cache. During watch, a new build will be
 * triggered only if one of the following condition is met:
 *
 * - a (page) file has been deleted
 * - a new (page) file has been added
 * - an existing (page) file meta have changed
 */

const fsa = require('../utils/fsa')

module.exports = ({ cache: enableCache } = {}) => {
  const cache = enableCache ? new Map() : null

  const readFile = async file => {
    const content = await fsa.readFile(file, 'utf8')
    const match = content.match(
      /\<\!\-\- *routify:options +((.|[\r\n])+?) *\-\-\>/m
    )
    const matchedContent = match && match[1]
    if (cache) {
      cache.set(file, matchedContent)
    }
    return matchedContent
  }

  const parse = async matchedContent => {
    const meta = {}
    if (matchedContent) {
      const [, prop, value] = matchedContent.match(/(.+) *= *((.|[\r\n])+)/m)
      meta[prop] = eval(`(${value})`)
    }
    return meta
  }

  if (cache) {
    const get = async file => {
      const metaString = cache.has(file)
        ? cache.get(file)
        : await readFile(file)
      return parse(metaString)
    }

    const refreshFile = async file => {
      if (!cache.has(file)) {
        await readFile(file)
        return true
      }
      const oldValue = cache.get(file)
      const newValue = await readFile(file)
      return oldValue !== newValue
    }

    const deleteFile = file => cache.delete(file)

    return { get, refreshFile, deleteFile }
  } else {
    const get = async file => parse(await readFile(file))

    const refreshFile = async () => {
      await readFile
      return true
    }

    const deleteFile = () => true

    return { get, refreshFile, deleteFile }
  }
}
