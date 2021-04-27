<script>
    export let payload
</script>

{#await payload.node.meta.processEnv then data}
    <strong>process.env</strong>
    <pre>
        {JSON.stringify(data, null, 2)}
    </pre>
{/await}
