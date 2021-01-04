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
  <a href={$url('./from')}>from</a>
  <a href={$url('./to')}>to</a>
  <a href={$url('./delayed-page')}>delayed page</a>
</nav>

<div>afterPageLoad count: {events.length}</div>

<div>isChangingPage: {$isChangingPage}</div>
<slot />