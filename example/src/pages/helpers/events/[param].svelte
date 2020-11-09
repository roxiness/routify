<script>
  import { params, afterPageLoad, isChangingPage, url } from '@roxi/routify'
  export let index
  let aPLCount = 0
  $afterPageLoad((event) => {
    aPLCount = aPLCount + 1
  })
</script>

<div>
    index = {index}
  <h3>param.svelte</h3>
  [param.svelte] AfterPageLoad count: {aPLCount}
</div>

<!-- routify:options param-is-page=true -->