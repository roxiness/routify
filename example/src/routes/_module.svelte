<script>
    import FileTree from '../components/FileTree.svelte'
    export let payload
</script>

<FileTree node={payload.node} />

<h1>Module</h1>

<nav>
    <a href="/">home</a>
    <a href="/file1">file1</a>
    <a href="/folder1/">folder1</a>
    <a href="/folder1/file1">folder1/file1</a>
    <a href="/folder1/my-title">folder1/my-title</a>
</nav>

<slot><!-- optional fallback --></slot>
