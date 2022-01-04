<script>
    export let node
    $: ({ children, ...nodeWithoutChildren } = $node)
</script>

<pre>
    {JSON.stringify(nodeWithoutChildren, null, 2)}    
</pre>
