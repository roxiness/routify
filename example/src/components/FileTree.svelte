<script>
    import { isActive } from '../../../lib/runtime/helpers'
    import { slide } from 'svelte/transition'
    import { cubicOut } from 'svelte/easing'
    export let node
    export let nested = 0
    const anim = { duration: 150, easing: cubicOut }
    const t = nested ? slide : x => x
</script>

<ul transition:t|local={anim}>
    {#each node.children as child (child.path)}
        <li>
            <a href={child.path} class:active={$isActive(child.path)}
                >{child.name}</a>
            {#if $isActive(child.path) && child.children.length}
                <svelte:self node={child} nested={nested + 1} />
            {/if}
        </li>
    {/each}
</ul>

<style>
    .active {
        font-weight: bold;
    }
    li {
        list-style: none;
    }
    * :global(ul) {
        margin-left: 16px;
    }
</style>
