<script>
    let dark = null
    $: if (dark !== null)
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
</script>

<label>
    Theme:
    <input type="checkbox" bind:checked={dark} />
    {dark == null ? 'auto' : dark ? 'dark' : 'light'}
</label>

<style>
    label {
        position: fixed;
        top: 0;
        right: 0;
        padding: 12px 16px;
        background: var(--background-color);
        border-radius: 0 0 0 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1), 0 0 10px rgba(255, 255, 255, 0.1);
        z-index: 1000;
    }
    label input {
        display: none;
    }
</style>
