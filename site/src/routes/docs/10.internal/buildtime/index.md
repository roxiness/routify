<script>
    import { resolveNode } from '@roxi/routify'
    import FilesViewer from '#cmp/FilesViewer.svelte'
    import Example from '#cmp/Example.svelte'
</script>


# Buildtime

Routify supports buildtime data through meta files.

Buildtime data can be dynamically imported by setting `split` to true

<FilesViewer root={resolveNode('../example')} focus="index.svelte" />

---

# Example
<Example offset="../example" />
