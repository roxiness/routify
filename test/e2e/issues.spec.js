import thc from 'test-hmr'
import { click } from 'test-hmr/helpers'
import { ignoreConsoleWarnings, goBack } from './helpers'

describe('issues', () => {
  thc.skip`
    # #41 [id].svelte with no params resolves to fallback

    --- pages/[id].svelte ---

    <script>
      export let id
    </script>

    <pre>id={id}</pre>

    --- _fallback.svelte ---

    fallback

    * * * * *

    fallback
  `

  thc.only`
    # #50 folder name as parameter

    --- pages/index.svelte ---

    <script>
      import { url } from '@sveltech/routify'

      $: href = $url(
        '/:language/:detail',
        { detail: 'blabla', language: 'fr'}
      )
    </script>

    <a id="var" href={href}>character.romaji</a>

    <a id="inline" href={
      $url(
        '/:language/:detail',
        { detail: 'character.romaji', language: 'hiragana'}
      )
    }>inline romaji</a>

    --- pages/[language]/[detail].svelte ---

    <script>
      import { params } from '@sveltech/routify'
      export let detail
      $: language = $params.language
    </script>

    <x-focus>
      [{language}]:"{detail}"
    </x-focus>

    * * * * *

    ${[
      // FIXME we shouldn't have this warning
      ignoreConsoleWarnings("<Detail> was created with unknown prop 'scoped'"),
      click('#var'),
    ]}

    [fr]:"blabla"

    ${[goBack(), click('#inline')]}

    [hiragana]:"character.romaji"
  `
})
