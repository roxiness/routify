<script>
    import Router from '@roxi/routify/lib/runtime/Router.svelte'
    export let payload

    $: pages = [
        // { activeUrl: Internal().set('/experiments/numbers/102') },
        // { activeUrl: Address },
        // { activeUrl: Internal() },
    ]

    let useInternal = true
</script>

{#each Array(10) as entry, index}
    <div>
        <a href="/experiments/numbers/{index + 95}">{95 + index}</a>
    </div>
{/each}

<Router offset="-2" url="/experiments/numbers/102/index" />
<Router offset={payload.node} />
<Router offset url="/experiments/numbers/104" state="internal" />

<button on:click={() => (useInternal = !useInternal)}
    >useInternal: {useInternal}</button>
