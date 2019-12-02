
const { name } = require('../package.json')
const { generateRoutes } = require('./watcher')

module.exports = function svelteFileRouter(inputOptions) {
  const firstBuildPromise = generateRoutes({
    singleBuild: !process.env.ROLLUP_WATCH,
    ...inputOptions,
  })
  return {
     name,
     async buildStart() {
       await firstBuildPromise
     }
  }
}
