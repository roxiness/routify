<script>
  import { ready } from '@sveltech/routify'
  
  const data = fetch('https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay=2000ms')
    .then(res => res.json())
    .then(res => $ready() && res)


  setTimeout(() => {
    parent.postMessage('hello')
  }, 500);
</script>

<h1>Delay 2</h1>
{#await data then value}{JSON.stringify(value)}{/await}
