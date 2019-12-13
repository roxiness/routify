const { name } = require('../package.json')
const { start } = require('../lib/services/interface')

module.exports = function svelteFileRouter(inputOptions) {
  const { waitIdle, close } = start({
    watch: process.env.ROLLUP_WATCH,
    ...inputOptions,
  })

  return {
    name,

    // prevent the build from running, until routes.js is completely generated
    //
    // NOTE Nollup 0.9.0 does not implement buildStart correctly (but
    //      renderStart is probably better suited to our purpose anyway)
    //
    async renderStart() {
      await waitIdle()
    },

    // test-only API
    ...(process.env.NODE_ENV === 'test' && {
      // needed for the test runner to shut up properly (otherwise the process
      // will hang because of dangling file watchers)
      async _close() {
        return close()
      },
    }),
  }
}
