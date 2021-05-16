<script>
    import { derived } from 'svelte/store'
    import {
        AddressReflector,
        InternalReflector,
        LocalStorageReflector,
    } from '@roxi/routify'

    const reflectors = {
        AddressReflector,
        InternalReflector,
        LocalStorageReflector,
    }

    export let router
    let show = false

    const urlHooks = derived(router.urlReflector, urlReflector => {
        return Object.entries(reflectors).map(([name, reflector]) => ({
            name,
            isActive: urlReflector.constructor.name === name,
            reflector,
        }))
    })

    const toggleMenu = () => {
        console.log('toggle')
        show = !show
    }
    const selectReflector = reflector => (router.urlReflector = reflector)
</script>

<div class="options">
    <div class="cog" on:click={toggleMenu}>⚙</div>
    {#if show}
        <ul class="menu">
            {#each $urlHooks as { name, isActive, reflector }}
                <li class:isActive on:click={() => selectReflector(reflector)}>
                    {name}
                </li>
            {/each}
        </ul>
    {/if}
</div>

<style>
    .cog,
    li {
        cursor: pointer;
    }
    .options {
        position: absolute;
        top: 4px;
        right: 8px;
    }
    .menu {
        position: absolute;
        right: 0;
        background: white;
        box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.02);
        padding: 8px 20px;
        list-style: none;
        border-radius: 4px;
    }
    .isActive {
        font-weight: bold;
    }
</style>
