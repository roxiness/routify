<script>
    export let payload
    import Loader from '../../../components/Loader.svelte'
    let count = 0
    setInterval(() => count++, 1000)
</script>

<div>
    <strong>Luke:</strong>
    {payload.node.meta.luke.name}
</div>
<div>
    {#await payload.node.meta.darth then data}
        <strong>Darth:</strong>
        {data.name}
    {/await}
</div>

{count}

<Loader />
