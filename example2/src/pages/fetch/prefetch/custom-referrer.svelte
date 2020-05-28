<script>
  import { url, prefetch } from '@sveltech/routify'
  let reqUrl = '//localhost:5432/generic?foo=bar'
  let reqOptions = JSON.stringify({ headers: { 'x-delay': 0 } }, null, 2)
  let prefetchOptions = JSON.stringify({ prefetchValidFor: 60 }, null, 2)

  let method = 'GET'
  $: href = $url('../custom', { url: reqUrl, options: reqOptions })
  function handlePrefetch() {
    console.log(JSON.parse(prefetchOptions))
    prefetch(href, JSON.parse(prefetchOptions))
  }
</script>

<style>
  input,
  textarea {
    display: block;
    width: 100%;
  }
  .form {
    width: 480px;
  }
</style>

<div class="form">
  <label for="url">
    URL
    <input type="text" id="url" bind:value={reqUrl} />
  </label>
  <label for="options">
    Mock API options
    <textarea
      type="text"
      id="options"
      cols="50"
      rows="5"
      bind:value={reqOptions} />
  </label>
  <label for="prefetch-options">
    Prefetch options
    <textarea
      type="text"
      id="prefetch-options"
      cols="50"
      rows="5"
      bind:value={prefetchOptions} />
  </label>

  <div>{href}</div>
  <div>
    <button on:click={handlePrefetch} id="prefetch">Prefetch</button>
    <a id="goto" {href}>Goto</a>
  </div>
</div>
