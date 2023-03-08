<script>
    const themes = ['auto', 'light', 'dark', 'dim', 'grape', 'choco']

    let checked = 'dim'
    $: globalThis.document?.firstElementChild?.setAttribute('color-scheme', checked)
</script>

<div class="theme-picker" tabindex="0">
    <div class="thing">[theme]</div>
    <form>
        {#each themes as theme}
            <div>
                <input
                    bind:group={checked}
                    type="radio"
                    id={theme}
                    name={theme}
                    value={theme} />
                <label for={theme}>{theme}</label>
            </div>
        {/each}
    </form>
</div>

<style>
    .thing {
        cursor: pointer;
        position: absolute;
        bottom: 0;
    }

    form {
        position: absolute;
        display: none;
        bottom: 20px;
        /* transform: translateY(100%); */
        background: var(--surface-2);
        padding: var(--size-2) var(--size-7) var(--size-2) var(--size-5);
    }
    :focus form {
        display: block;
    }
    label {
        margin: var(--size-2);
    }
</style>
