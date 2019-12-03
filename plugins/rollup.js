const { name } = require('../package.json')
const { start } = require('../lib/services/interface')

module.exports = function svelteFileRouter(inputOptions) {

  const firstBuildPromise = start({
    watch: process.env.ROLLUP_WATCH,
    ...inputOptions,
  })
  return {
    name,
    async buildStart() {
      await firstBuildPromise
    }
  }
}