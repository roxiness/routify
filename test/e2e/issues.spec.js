import thc from 'test-hmr'

describe('issues', () => {
  thc.only`
    # #41 [id].svelte with no params

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
