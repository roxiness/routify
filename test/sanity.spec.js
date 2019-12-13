import thc from 'test-hmr'
import {
  click,
  goto,
  gotoState,
  expectPageError,
  expectPageLoad,
  expectNoPageLoad,
} from 'test-hmr/helpers'

describe('sanity check: test-hmr', () => {
  thc`
    # runs main.js

    --- main.js ---

    document.body.innerHTML = 'ok'

    * * * * *

    ok
  `

  thc`
    # fixtures a Svelte app

    --- App.svelte ---

    Hello

    *****

    Hello
  `

  thc`
    # fixtures a Routify app

    --- pages/index.svelte ---

    <h2 data-focus>Home</h2>

    --- pages/about.svelte ---

    <h2 data-focus>About</h2>

    * * * * *

    Home

    ${goto('about')}

    About
  `

  thc`
    # SPA navigation

    --- pages/index.svelte ---

    <a href="/about">About</a>

    <h2 data-focus>Home</h2>

    --- pages/about.svelte ---

    <h2 data-focus>About</h2>

    * * * * *

    Home

    ${[
      // homemade in-page navigation
      expectNoPageLoad(),
      click('a'),
    ]}

    About

    ${[
      // direct navigationby URL
      expectPageLoad(),
      goto('/'),
    ]}

    Home

    ${[
      // in-page navigation with helper
      expectNoPageLoad(),
      gotoState('/about'),
    ]}

    About
  `

  describe('HMR', () => {
    thc` # new route files are only written to disk at specified step

      --- pages/index.svelte ---

      zero

      --- pages/foo.svelte ---

      ::1 foofoo

      --- pages/bar.svelte ---

      ::0 babar

      * * * * *

      ::0::

        zero

        ${[
          // foo.svelte should not be written at step ::0
          expectPageError('Route could not be found.'),
          goto.push('/foo'),
        ]}

        zero

        ${goto.push('/bar')}

        babar

      ::1::

        babar
    `

    // This is the full version of the above test -- not passing currently :(
    thc.skip` # new route files are only written to disk at specified step

      --- pages/index.svelte ---

      zero

      --- pages/foo.svelte ---

      ::1 foofoo

      --- pages/bar.svelte ---

      ::0 babar

      * * * * *

      ::0::

        zero

        ${[
          // foo.svelte should not be written at step ::0
          expectPageError('Route could not be found.'),
          goto.push('/foo'),
        ]}

        zero

        ${goto.push('/bar')}

        babar

      ::1::

        babar

        ${
          // we should be able to go to /foo now
          goto.push('/foo')
        }

        foofoo
    `
  })
})
