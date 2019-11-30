
const { name } = require('../package.json')
const { generateRoutes } = require('./watcher')

module.exports = function svelteFileRouter(inputOptions) {
  generateRoutes(inputOptions)  
  return Object.assign(
    { name },
  )
}
