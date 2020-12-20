<script>
  import { afterPageLoad, url } from '@roxi/routify'
  let count = 0
  $afterPageLoad((event) => {
    count = count + 1
  })
</script>

<!-- routify:options query-params-is-page=true -->

<div>
  <a href={null} use:$url={{ param: 'foo' }}>Foo</a>
  <a href={null} use:$url={{ param: 'bar' }}>Bar</a>
  <a href={null} use:$url={{ overload: 'overloaded' }}>overload static</a>
  <a href={null} use:$url={{ overload: 'overloaded'+count }}>overload dynamic</a>
</div>
<div>
    [is-page.svelte] afterPageLoad count: {count}
</div>