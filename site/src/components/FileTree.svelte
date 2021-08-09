<script>
    import { isActive } from '@roxi/routify'
    import { slide } from 'svelte/transition'
    export let node
    export let nested = 0
    const getName = node => node.name + (node.meta.status ? ` [${node.meta.status}]` : '')
</script>

<ul class="nested-{nested}">
    {#each node.children.indexed as child}
        {#if child.name !== 'example'}
            <li>
                <a href={child.path} class:active={$isActive(child.path)}
                    >{getName(child)}</a>
                {#if child.children.indexed.length}
                    <div transition:slide|local>
                        <svelte:self node={child} nested={nested + 1} />
                    </div>
                {/if}
            </li>
        {/if}
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
