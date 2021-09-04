<script>
    import { resolveNode } from '@roxi/routify'
    import FilesViewer from '#cmp/FilesViewer.svelte'
    import Browser from '#cmp/minibrowser/MiniBrowser.svelte'
    import Example from '#cmp/Example.svelte'
</script>

In Routify files and folders in `src/routes` are automatically mapped to routes.

A route can be written as `src/routes/contact.svelte` or `src/routes/contact/index.svelte`. Both of these URLs will correspond to `/contact`.

<Example path="../example" focus="index.svelte" title="Structure example" />
    