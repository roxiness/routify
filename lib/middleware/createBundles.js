const filewriter = require('../services/file-writer')

/**
 * 
 * @param {TreePayload} payload 
 */
function createBundles(payload) {
  const { tree, options } = payload
  const { pages, routifyDir } = options

  const bundles = getBundles(tree)
  const files = Object.entries(bundles).map(generateFileTemplates)
  writeFiles(files)

  /**
   *  generateFileTemplates
   * @param {array} input
   */
  function generateFileTemplates([filename, bundle]) {
    const imports = bundle
      .map(file => `import ${file.id} from '${file.importPath}'`)
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
    tree.children.forEach(node => {
      const bundleId = node.meta.$$bundleId
      // skip nodes without bundle id and folders without _layout/_folder components
      if (bundleId && node.importPath) {
        bundles[bundleId] = bundles[bundleId] || []
        bundles[bundleId].push(node)
      }
      if (node.children) getBundles(node, bundles)

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

module.exports = createBundles