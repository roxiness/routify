<script>
    import { isActive } from '@roxi/routify'
    import { slide } from 'svelte/transition'
    import { cubicOut } from 'svelte/easing'
    export let node
    export let nested = 0
    const anim = { duration: 150, easing: cubicOut }
</script>

<ul>
    {#each node.children.indexed as child (child.path)}
        <li>
            <a href={child.path} class:active={$isActive(child.path)}>{child.name}</a>
            {#if $isActive(child.path) && child.children.indexed.length}
                <div transition:slide|local>
                    <svelte:self node={child} nested={nested + 1} />
                </div>
            {/if}
        </li>
    {/each}
</ul>

<style>
    ul {
        display: block;
        margin: 0;
    }
    div {
        margin-top: 1rem;
    }
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
