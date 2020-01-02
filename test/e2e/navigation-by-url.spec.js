import thc from 'test-hmr'
import { goto, expectPageLoad } from 'test-hmr/helpers'

describe('navigation by url', () => {
  thc`
    # reloads the page, & does not 404

    --- pages/index.svelte ---

    index

    --- pages/two.svelte ---

    two

    * * * * *

    index

    ${[expectPageLoad(), goto('/two')]}

    two
  `
})
