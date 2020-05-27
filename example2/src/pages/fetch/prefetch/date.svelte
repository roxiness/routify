<script>
  import { ready } from '@sveltech/routify'

  const data = fetch('//worldclockapi.com/api/json/est/now')
    .then(res => res.json())
    .then(res => $ready() && res)

  setTimeout(() => {
    parent.postMessage('hello')
  }, 500)
</script>

<h1>Date</h1>
<div class="result">
  {#await data then value}{value.currentFileTime}{/await}
</div>
