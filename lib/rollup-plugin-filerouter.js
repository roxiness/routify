
const { name: NAME } = require('../package.json')
const { generateRoutes } = require('./watcher')





module.exports = async function svelteFileRouter(inputOptions) {
  const hooks = await generateRoutes(inputOptions)
  
  return Object.assign(
    { name: NAME },
    hooks
  )
}
