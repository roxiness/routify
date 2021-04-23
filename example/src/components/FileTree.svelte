<script>
    export let node
</script>

<ul>
    {#each node.children as child}
        <li>
            <a href={child.path}>{child.name}</a>
            <svelte:self node={child} />
        </li>
    {/each}
</ul>
