<script>
  import { ready } from '@sveltech/routify'

  const data = fetch('https://www.mocky.io/v2/5185415ba171ea3a00704eed')
    .then(res => res.json())
    .then(res => $ready() && res)

  setTimeout(() => {
    parent.postMessage('hello')
  }, 500)
</script>

<h1>Delay 0</h1>
<div class="result">
  {#await data then value}{JSON.stringify(value)}{/await}
</div>
