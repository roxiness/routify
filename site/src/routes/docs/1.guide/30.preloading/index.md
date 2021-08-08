<script>
    import { resolveNode } from '@roxi/routify'
    import FilesViewer from '#cmp/FilesViewer.svelte'
    import Example from '#cmp/Example.svelte'
</script>



<FilesViewer root={resolveNode('../example')} focus="index.svelte" />

---

# Example
<Example offset="../example" />
