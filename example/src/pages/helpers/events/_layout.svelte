<script>
  import { afterPageLoad, url } from '@sveltech/routify'
  let events = []
  $afterPageLoad(event => {
    console.log('wtf', event)
    events = [...events, event]
  })
  
</script>

<slot />

<nav>
  <a href="{$url('./:param', {param: 'param1'})}">param1</a>
  <a href="{$url('./:param', {param: 'param2'})}">param2</a>
</nav>

{#each events as event}
<div>
  afterPageLoad: {event.title}
</div>
  <!-- content here -->
{/each}
