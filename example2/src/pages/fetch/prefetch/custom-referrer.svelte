<script>
  import { url, prefetch } from '@sveltech/routify'
  let reqUrl = '//localhost:5432/date'
  let reqHeader = ''
  let method = 'GET'
  $: href = $url('../custom', { url: reqUrl, header: reqHeader })
  function handlePrefetch(){
    prefetch(href)
  }
</script>

<style>
  input,
  textarea {
    display: block;
  }
</style>

<label for="url">
  URL
  <input type="text" id="url" bind:value={reqUrl} />
</label>
<label for="header">
  Header
  <textarea type="text" id="header" cols="50" rows="5" bind:value={reqHeader} />
</label>

<div>
  <a {href}>Goto</a>
  {href}
</div>
<div>
  <button on:click={handlePrefetch} id="prefetch">Prefetch</button>
</div>
