<script>
    import Widget1 from '../widget1/App.svelte'
    import Widget2 from '../widget2/App.svelte'
    import FileTree from '../components/FileTree.svelte'
    export let payload
</script>

<h1>Module</h1>
<FileTree node={payload.node} />

<slot><!-- optional fallback --></slot>

<div>
    <Widget1 />
</div>
<div>
    <Widget2 />
</div>
