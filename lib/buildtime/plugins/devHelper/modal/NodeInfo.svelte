<script>
    export let node
    $: ({ children, ...nodeWithoutChildren } = $node)

    const printToConsole = () => {
        console.log($node)
    }
</script>

<button on:click={printToConsole}>print to console</button>

<pre>
    {JSON.stringify(nodeWithoutChildren, null, 2)}    
</pre>
