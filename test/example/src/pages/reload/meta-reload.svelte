<script>
  import { url, page } from '@roxi/routify'
  let date = Date.now()
</script>

<div id="page-date">
  page date: {date}
</div>

<button on:click={$page.reset()}>invalidate page</button>
<button on:click={$page.parent.reset()}>invalidate page's parent</button>
