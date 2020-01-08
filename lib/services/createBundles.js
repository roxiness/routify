const filewriter = require('./file-writer')

module.exports = function(routes, { pages, outputDir }) {
  const bundles = getBundles(routes)
  const files = Object.entries(bundles).map(generateFileTemplates)
  writeFiles(files)

  /**
   *  generateFileTemplates
   * @param {array}
   */
  function generateFileTemplates([filename, bundle]) {
    const imports = bundle
      .map(file => `import ${file.component} from '${pages + file.filepath}'`)
      .join('\r\n')
    const exports = `export  {\n${bundle
      .map(file => '  ' + file.component)
      .join(',\r\n')}\r\n}`
    const body = `${imports} \r\n\r\n ${exports}`
    return { filename, body }
  }

  /**
   * getBundles
   * @param {array} routes
   */
  function getBundles(routes) {
    const bundles = {}
    routes.forEach(route => {
      const bundleId = route.options.bundleId
      if (bundleId) {
        bundles[bundleId] = bundles[bundleId] || []
        bundles[bundleId].push(route)
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
      filewriter(body, outputDir + '/' + filename)
    )
  }
}
