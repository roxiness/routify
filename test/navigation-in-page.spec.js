import thc from 'test-hmr'
import { click, expectNoPageLoad } from 'test-hmr/helpers'

describe('navigation in-page', () => {
  thc`
    # does not reload browser page

    --- pages/_layout.svelte ---

    <a href="/">Go home</a>
    <a href="/about">Go about</a>
    <x-focus>
      <slot />
    </x-focus>

    --- pages/index.svelte ---

    Index page

    --- pages/about.svelte ---

    About page

    * * * * *

    Index page

    ${expectNoPageLoad()}

    ${click('a[href="/about"]')}

    About page

    ${click('a[href="/"]')}

    Index page
  `
})
