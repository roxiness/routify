const { thc, click, goto } = require('./thc')

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

    <h2 data-focus>Home</h2>
    <a href="/about">About</a>

    --- pages/about.svelte ---

    <h2 data-focus>About</h2>

    * * * * *

    Home

    ${click('a')}

    About
  `
})
