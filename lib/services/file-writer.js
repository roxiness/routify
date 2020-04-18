const path = require('path')
const fsa = require('../utils/fsa')
const log = require('../utils/log')

module.exports = async function fileWriter(content, outputFile) {
  const filenamePromise = resolveOutputFile(outputFile)
  const filename = await filenamePromise
  await fsa.mkdir(path.dirname(filename), { recursive: true })
  await fsa.writeFile(filename, content, 'utf8')
  log.debug('Written', filename)
}

const resolveOutputFile = async input => {
  const value = typeof input === 'function' ? await input() : input
  return path.resolve(value)
}
