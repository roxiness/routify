<script>
  import { prefetch, layout, url } from '@sveltech/routify'
  setTimeout(() => {
    // prefetch('/fetch/users')
  }, 2000)

  const batchNodes = $layout.parent.children.find(
    c => c.path === '/fetch/batch'
  ).children

  // batchNodes.forEach(node => prefetch(node.path))
</script>

{#each batchNodes as child}
  <a href={$url(child.path)}>{child.title}</a>
{/each}

<a href="/fetch/users">users</a>
