<div>
    <span>composition/_module.custom-svelte</span>
    <slot />
</div>

<style>
    div {
        border: 4px solid red;
        border-top-width: 24px;
    }
    div > span {
        position: absolute;
        top: -20px;
        color: white;
    }
</style>
