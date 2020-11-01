<script>
  import { afterPageLoad, url } from '@roxi/routify'
  let count = 0
  $afterPageLoad((event) => {
    count = count + 1
  })
</script>

<!-- routify:options param-is-page=true -->

<div>
  <a href={null} use:$url={{ param: 'foo' }}>Foo</a>
  <a href={null} use:$url={{ param: 'bar' }}>Bar</a>
  <a href={null} use:$url={{ overload: 'overloaded' }}>overload it</a>
</div>
<div>
    [is-page.svelte] afterPageLoad count: {count}
</div>