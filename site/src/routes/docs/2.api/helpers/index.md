<script>
    import {context as context2} from '@roxi/routify'
    export let context
</script>


{#each context.node.parent.children.indexed as node}
    <div>
        <svelte:component this={node.children.index.component} />
    </div>
{/each}