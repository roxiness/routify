const filewriter = require('./file-writer')

module.exports = function (tree, { pages, routifyDir }) {
  const bundles = getBundles(tree)
  const files = Object.entries(bundles).map(generateFileTemplates)
  writeFiles(files)

  /**
   *  generateFileTemplates
   * @param {array} input
   */
  function generateFileTemplates([filename, bundle]) {
    const imports = bundle
      .map(file => `import ${file.id} from '${pages + file.filepath}'`)
      .join('\r\n')
    const exports = `export  {\n${bundle
      .map(file => '  ' + file.id)
      .join(',\r\n')}\r\n}`
    const body = `${imports} \r\n\r\n ${exports}`
    return { filename, body }
  }

  /**
   * getBundles
   * @param {array} tree
   */
  function getBundles(tree, bundles = {}) {
    tree.forEach(file => {
      const bundleId = file.meta.$$bundleId
      if (file.children) getBundles(file.children, bundles)
      else if (bundleId) {
        bundles[bundleId] = bundles[bundleId] || []
        bundles[bundleId].push(file)
      }

    })
    return bundles
  }

  /**
   * writeFiles
   * @param {array} files
   */
  function writeFiles(files) {
    files.forEach(({ filename, body }) =>
      filewriter(body, routifyDir + '/' + filename)
    )
  }
}
