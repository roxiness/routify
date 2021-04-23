<script>
    import { isActive } from '../../../runtime/helpers'
    export let node
</script>

<ul>
    {#each node.children as child}
        <li>
            <a href={child.path}>{child.name}</a>
            {$isActive(child.path)}
            <svelte:self node={child} />
        </li>
    {/each}
</ul>
