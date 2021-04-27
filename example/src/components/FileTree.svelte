<script>
    import { isActive } from '../../../lib/runtime/helpers'
    export let node
</script>

<ul>
    {#each node.children as child}
        <li>
            <a href={child.path} class:active={$isActive(child.path)}
                >{child.name}</a>
            {child.path}
            <svelte:self node={child} />
        </li>
    {/each}
</ul>

<style>
    .active {
        font-weight: bold;
    }
</style>
