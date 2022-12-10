<script>
    export let context
    const referrerUrl = context.route.state.redirectedBy?.url
</script>

{#if referrerUrl}
    Got redirected from
    <div>
        <strong>
            <a href={referrerUrl}>{referrerUrl}</a>
        </strong>
    </div>
{:else}
    Go to <strong>redirect</strong> to be redirected here
{/if}
