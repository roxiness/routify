import thc from 'test-hmr'

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
})
