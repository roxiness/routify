<script>
  import { beforeUrlChange, url } from '@roxi/routify'

  $beforeUrlChange(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return true
  })
</script>

<a href={$url('./page2')}>page2</a>
