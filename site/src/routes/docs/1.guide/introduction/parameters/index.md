<script>
    import { resolveNode } from '@roxi/routify'
    import FilesViewer from '#cmp/FilesViewer.svelte'
    import Example from '#cmp/Example.svelte'
</script>

# Parameters

Parameters can be accessed in Routify with the `$params` helper. 

<FilesViewer root={resolveNode('../example')}  />

---

# Example
<Example offset="../example" />
