<script>
    export let payload
    console.log(payload.node.meta)
</script>

{#await payload.node.meta.kanye then data}
    <strong>Kanye:</strong>
    <pre>
        {JSON.stringify(data, null, 2)}
    </pre>
{/await}
