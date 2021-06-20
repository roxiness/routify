<script>
    import FileTree from '../../components/FileTree.svelte'
    export let context
</script>

<h1>Module</h1>
<FileTree node={context.node} />

<slot />
