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
    },
    ...process.env.NODE_ENV === 'test' && {
      async _close() {
        const { close } = await firstBuildPromise
        return close()
      }
    }
  }
}
