<script>
    import { resolveNode } from '@roxi/routify'
    import FilesViewer from '#cmp/FilesViewer.svelte'
    import Example from '#cmp/Example.svelte'
</script>

# Structure

In Routify files and folders in `src/routes` are automatically mapped to routes.

A route can be written as `src/routes/contact.svelte` or `src/routes/contact/index.svelte`. Both of these URLs will correspond to `/contact`.

<FilesViewer filesPromise={resolveNode('../example').meta.files} />

---

# Example
<Example offset="../example" />
