<script>
    import { resolveNode } from '@roxi/routify'
    import FilesViewer from '#cmp/FilesViewer.svelte'
    import Example from '#cmp/Example.svelte'
</script>


The `$url` helper creates URLs from paths and parameters.

<FilesViewer root={resolveNode('../example')} focus="index.svelte" />

---

# URL Example
<Example offset="../example" />
