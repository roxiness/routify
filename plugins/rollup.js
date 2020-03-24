const { name } = require('../package.json')
const { start } = require('../lib/services/interface')

const wait = delay => new Promise(resolve => setTimeout(resolve, delay))

module.exports = function svelteFileRouter(inputOptions) {
  const { watchDelay } = inputOptions

  const { waitIdle, waitChange, close } = start({
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
      // watchDelay option
      //
      // this is intented to prevent a nasty race with
      // rollup-plugin-hot/autoccreate
      //
      // autocreate plugin is needed for HMR stability because Rollup crashes
      // and can't recover when it tries to import a missing file. autocreate
      // mitigates this by creating empty missing files; thus allowing Rollup
      // to keep humming
      //
      // the race however goes like this:
      //
      // - user rename/delete page file
      // - rollup picks file change
      // - rollup triggers build
      // - rollup-plugin-hot/autocreate sees deleted file in routes.js
      // - autocreate recreates just deleted file <--- HERE BE BUG
      // - routify picks file change
      // - routify recreates routes.js
      // - ... but too late, user has extraneous deleted file recreated
      // - rollup picks the change in routes.js...
      //
      // this delay is intented to give some time to routify to pick the
      // change first (and so rollup plugin will block start of rollup build
      // until routes.js has been generated)
      //
      // we can't be too greedy, because this delay will be paid for _any_
      // file change when user is working, even when unneeded (and in this
      // case the delay will be consumed in full -- nominal case is worst
      // case) :-/
      //
      // 20ms seems to work on my machine
      //
      if (watchDelay) {
        // we stop waiting early if Routify has caught the change (waitChange)
        // -- this ensures optimal waiting time but, unfortunately, in the
        // marginal case of when user deletes/renames a Routify page file; we're
        // stil degenerate (i.e. wait full delay) for any other source watched
        // by Rollup...
        await Promise.race([wait(watchDelay), waitChange()])
      }

      // prevent build from starting until Routify has finished generating
      // routes.js (or Rollup would do a useless build with stalled routes.js)
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
