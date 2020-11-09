<script>
  import { ready } from '@roxi/routify'

  const data = fetch('/data.json')
    .then(res => res.json())
    .then(res => $ready() && res)

  setTimeout(() => {
    parent.postMessage('hello')
  }, 500)
</script>

<h1>Delay 2</h1>
<div class="result">
  {#await data then value}{JSON.stringify(value)}{/await}
</div>
