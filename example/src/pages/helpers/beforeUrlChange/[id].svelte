<script>
  import {
    afterPageLoad,
    beforeUrlChange,
    isChangingPage,
    url,
  } from '@sveltech/routify'
  let isChanging = []
  let beforeUrlChangeRan = false
  let afterPageLoadRan = false

  $beforeUrlChange(event => (beforeUrlChangeRan = true))
  $afterPageLoad(page => (afterPageLoadRan = true))

  $: isChanging = [...isChanging, $isChangingPage]
</script>

<a href={$url(null, { id: 'foo' })}>foo</a>
<a href={$url(null, { id: 'bar' })}>bar</a>

<div>
  <h3>did it run?</h3>
  {#if beforeUrlChangeRan}
    <div>beforeUrlChange ran</div>
  {/if}
  {#if afterPageLoadRan}
    <div>afterPageLoad ran</div>
  {/if}
  <div>isChanging {isChanging}</div>
</div>
