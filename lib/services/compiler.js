const { makeLegalIdentifier } = require('rollup-pluginutils')
const { filepathToUrl } = require('../utils')

module.exports = function compiler(files) {
  return files.map(route => {
    route.path = filepathToUrl(route.filepath)
    route.component = makeLegalIdentifier(route.path)
    if (!route.isLayout) {
      route.layouts = route.layouts.map(layout => {
        layout.path = filepathToUrl(layout.filepath)
        layout.component = makeLegalIdentifier(layout.path)
        return layout
      })
    }
    return route
  })
}
