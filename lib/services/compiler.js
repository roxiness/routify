const { makeLegalIdentifier } = require('rollup-pluginutils')
const { stripExtension } = require('../utils')

module.exports = function compiler(files) {
  return files.map(route => {
    route.path = stripExtension(route.filepath)
    route.component = makeLegalIdentifier(route.path)
    if (!route.isLayout) {
      route.layouts = route.layouts.map(layout => {
        layout.path = stripExtension(layout.filepath)
        layout.component = makeLegalIdentifier(layout.path)
        return layout
      })
    }
    return route
  })
}
