<script>
    import { meta } from '@roxi/routify'
    let show
    console.log($meta)
</script>

<h1>Routify 3 App</h1>

<h4>Plain meta</h4>
<pre>
    {JSON.stringify($meta, null, 2)}    
</pre>

<br />
<br />

{#if !show}
    <button on:click={() => (show = true)}>show dynamic imported meta</button>
{:else}
    <h4>dynamic imported meta</h4>
    <pre>
    {#await $meta.luke.data() then data}
    {JSON.stringify(data, null, 2)}
    {/await}
</pre>
{/if}
