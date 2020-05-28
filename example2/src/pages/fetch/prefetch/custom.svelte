<script>
  import { ready, params } from '@sveltech/routify'
  console.log('fetching', $params.url)
  $: dataPromise = fetch($params.url, { mode: 'cors' })
    .then(res => res.json())
    .then(res => $ready() && res)
  $: dataPromise.then(r => console.log('returned', r))
</script>

<div class="result">
  <!-- {#await data then value}{value.currentFileTime}{/await} -->
</div>

<h3>Request</h3>
<pre>{JSON.stringify($params, null, 2)}</pre>

<h3>Response</h3>
{#await dataPromise then data}
  <pre>{JSON.stringify(data, null, 2)}</pre>
{/await}
