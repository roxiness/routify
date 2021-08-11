<script>
    import { isActive } from '@roxi/routify'
    import { slide } from 'svelte/transition'
    export let node
    export let nested = 0
    export let rewrite = path => path
    const getName = node => node.name + (node.meta.status ? ` [${node.meta.status}]` : '')
</script>

<ul class="nested-{nested}">
    {#each node.children.indexed as child}
        {#if child.name !== 'example'}
            <li>
                <a href={rewrite(child.path)} class:active={$isActive(child.path)}
                    >{getName(child)}</a>
                {#if child.children.indexed.length}
                    <div transition:slide|local>
                        <svelte:self node={child} nested={nested + 1} {rewrite} />
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
    ul.nested-0 {
        margin: 0;
    }
    ul.nested-0 > li {
        border-bottom: 1px solid black;
    }
    ul {
        margin-left: 16px;
    }
</style>
