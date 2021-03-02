<script>
  import { url, node } from '@roxi/routify'
  let date = Date.now()
</script>

<div id="layout-date">
  layout date: {date}
</div>

<button on:click={$node.reset()}>invalidate layout</button>
<div style="border: solid 1px red">
  <slot />
</div>
