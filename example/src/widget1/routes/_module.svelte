<script>
    import FileTree from '../../components/FileTree.svelte'
    export let payload
</script>

<h1>Module</h1>
<FileTree node={payload.node} />

<slot />
