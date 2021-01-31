<script>
  import { layout } from '@roxi/routify'
</script>

{#each $layout.children as node}
  <div>
    <a href={node.path}>{node.title}</a>
  </div>
{/each}
