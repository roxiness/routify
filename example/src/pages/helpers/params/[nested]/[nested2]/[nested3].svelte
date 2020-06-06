<script>
  import { params } from '@sveltech/routify'
</script>

<div>
  {#each Object.entries($params) as [key, value]}
    <div>{key}-{value}</div>
  {/each}
</div>
