<script>
    import { resolveNode } from '@roxi/routify'
    import FilesViewer from '#cmp/FilesViewer.svelte'
    import Example from '#cmp/Example.svelte'
</script>




<FilesViewer filesPromise={resolveNode('../example/index').meta.files} exclude={['_module.svelte']} />

---

# Example
<Example offset="../example" />
