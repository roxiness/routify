<script>
  import { ready, params } from '@roxi/routify'
  
  let response = null
  let headers = null
  let json = null

  $: fetchData($params.url)

  async function fetchData(url) {
    response = await fetch($params.url, JSON.parse($params.options))    
    headers = [...response.headers.entries()]
    json = await response.json()
  }
</script>

<div class="result">
  <!-- {#await data then value}{value.currentFileTime}{/await} -->
</div>

<h3>Request</h3>
<pre>{JSON.stringify($params, null, 2)}</pre>

<h3>Response</h3>
<h4>Body</h4>
{#if json}
  {#each Object.entries(json) as [key, value]}
    <div id="result_{key}">
      <strong>{key}:</strong>
      <span class="value">{value}</span>
    </div>
  {/each}
  <pre>{JSON.stringify(json, null, 2)}</pre>
{/if}

<h4>Headers</h4>
{#if response}
  {#each headers as [key, value]}
     <div id="header_{key}">
      <strong>{key}:</strong>
      <span class="value">{value}</span>
    </div>
  {/each}
{/if}


<h3>Image test</h3>
<img style="width: 200px" src="/500.jpg" alt="">