<script>
  import {
    afterPageLoad,
    beforeUrlChange,
    isChangingPage,
    url,
  } from '@roxi/routify'
  let isChanging = []
  let beforeUrlChangeRan = 0
  let afterPageLoadRan = 0

  $beforeUrlChange((event, route, { url }) => {
    beforeUrlChangeRan++    
    return url.match('block-me') ? false : true
  })
  $afterPageLoad((page) => afterPageLoadRan++)

  $: isChanging = [...isChanging, $isChangingPage]
</script>

<a href={$url(null, { id: 'foo' })}>foo</a>
<a href={$url(null, { id: 'bar' })}>bar</a>
<a href={$url(null, { id: 'block-me' })}>block me</a>

<div>
  <h3>did it run?</h3>

  <div>beforeUrlChange ran {beforeUrlChangeRan}</div>

  <div>afterPageLoad ran {afterPageLoadRan}</div>

  <div>isChanging {isChanging}</div>
</div>
