<script>
    export let context
    const {meta} = context.node
</script>


**Luke:**
{context.node.meta.luke.name}


**Darth:**
{#await meta.darth then data}
    {data.name}
{/await}


**Leia:**
{#await meta.leia then data}
    {data.name}
{/await}

