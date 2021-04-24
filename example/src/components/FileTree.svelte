<script>
    import { isActive } from '../../../runtime/helpers'
    export let node
</script>

<ul>
    {#each node.children as child}
        <li class:active={$isActive(child.path)}>
            <a href={child.path}>{child.name}</a>
            <svelte:self node={child} />
        </li>
    {/each}
</ul>

<style>
    .active {
        font-weight: bold;
    }
</style>
