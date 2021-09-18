<script>
    // import { isActive } from '@roxi/routify'
    import { slide } from 'svelte/transition'
    import { activeHash } from './stores'
    export let node
    export let nested = 0
    export let rewrite = path => path
    const getName = node => node.name + (node.meta.status ? ` [${node.meta.status}]` : '')
    const noExample = node => !node.name.match(/^example\.?/)
    const noInternal = node => node.name !== 'internal'

    $activeHash = '' // we don't want the store to persist the hash when we navigate to and from
    $: isActive = path => `/docs/#${$activeHash}`.startsWith(path)
</script>

<ul class="nested-{nested}">
    {#each node.children.indexed.filter(noExample).filter(noInternal) as child}
        <li class:active={isActive(rewrite(child.path))}>
            <a href={rewrite(child.path)} style="padding-left: {nested * 12 + 0}px"
                >{getName(child)}</a>
            {#if !nested || (child.children.indexed.filter(noExample).length && isActive(rewrite(child.path)))}
                <div class="children" transition:slide|local>
                    <svelte:self node={child} nested={nested + 1} {rewrite} />
                </div>
            {/if}
        </li>
    {/each}
</ul>

<style>
    a {
        text-transform: capitalize;
        padding: 8px;
        width: 100%;
        display: block;
    }
    ul,
    li {
        font-size: 100%;
        display: block;
        margin: 0;
        padding: 0;
        width: 100%;
    }
    div {
        width: 100%;
    }
    .active > a {
        font-weight: bold;
    }

    li {
        list-style: none;
    }
    ul.nested-0 {
        margin: 0;
    }
    ul.nested-0 > * > a {
        text-transform: uppercase;
    }
    ul.nested-1 > li.active {
        border-left: 4px solid var(--color-grey-300);
        margin-left: -4px;
    }
    ul.nested-0 {
    }
    ul {
    }
    ul.nested-0 > li > a {
        color: var(--color-grey-500);
        font-weight: bold;
    }
</style>
