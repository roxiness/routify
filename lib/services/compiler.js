const { makeLegalIdentifier } = require('rollup-pluginutils')
const { filepathToUrl } = require('../utils')

module.exports = function compiler(files) {
  return files
    .filter(file => !file.isDir)
    .map(cmp => {
      cmp.path = filepathToUrl(cmp.filepath, cmp.ext)
      cmp.shortPath = cmp.path.replace(/\/(index|_fallback)$/, '')
      cmp.component = makeLegalIdentifier(cmp.path)
      return cmp
    })
}
