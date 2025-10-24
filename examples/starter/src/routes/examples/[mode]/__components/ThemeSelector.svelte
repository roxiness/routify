<script>
    const themes = ['auto', 'light', 'dark', 'dim', 'grape', 'choco']

    export let theme
</script>

<div class="theme-picker" tabindex="-1">
    <div class="thing">[theme]</div>
    <form>
        {#each themes as option}
            <div class="option">
                <input
                    bind:group={theme}
                    type="radio"
                    id={option}
                    name={option}
                    value={option} />
                <label for={option}>{option}</label>
            </div>
        {/each}
    </form>
</div>

<style>
    .theme-picker {
        position: fixed;
        inset: 8px 16px auto auto;
    }
    .thing {
        cursor: pointer;
    }

    form {
        position: absolute;
        inset: 20px 20px auto auto;
        display: none;
        background: var(--surface-1);
        box-shadow: var(--shadow-4);
    }
    :focus form {
        display: block;
    }
    label {
        padding: var(--size-3) var(--size-10) var(--size-3) var(--size-5);
        display: block;
    }
    .option:has(:checked) {
        background: var(--surface-3);
    }
    input {
        display: none;
    }
</style>
