<script>
    export let instance
    const { urlStore } = instance
</script>

{#if instance.options.debugger}
    <main>
        <div>
            <strong>urlStore:</strong>
            {$urlStore}
        </div>
        <slot />
    </main>
{:else}
    <slot />
{/if}

<pre>
    <!-- {JSON.stringify(instance, null, 2)} -->
</pre>

<style>
    main {
        position: relative;
        padding-top: 30px;
    }
    div {
        position: absolute;
        height: 30px;
        line-height: 30px;
        background: #eee;
        width: 100%;
        top: 0;
        left: 0;
        padding: 0 16px;
    }
</style>
