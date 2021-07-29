<script>
    import { resolveNode } from '@roxi/routify'
    import FilesViewer from '#cmp/FilesViewer.svelte'
    import Example from '#cmp/Example.svelte'
</script>

# Parameters

Parameters can be accessed in Routify with the `$params` helper. 

<FilesViewer filesPromise={resolveNode('../example').meta.files} />

---

# Example
<Example offset="../example" />
