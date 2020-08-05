<script>
  import { afterPageLoad, isChangingPage, url } from '@roxi/routify'
  let events = []
  $afterPageLoad((event) => {
    events = [...events, event]
  })
</script>

<nav>
  <a href={$url('./:param', { param: 'param1' })}>param1</a>
  <a href={$url('./:param', { param: 'param2' })}>param2</a>
  <a href={$url('./delayed-page')}>delayed page</a>
</nav>

<h3>after page load events:</h3>
{#each events as event}
  <div>afterPageLoad: {event.title}</div>
{/each}

<div>isChangingPage: {$isChangingPage}</div>
<slot />
