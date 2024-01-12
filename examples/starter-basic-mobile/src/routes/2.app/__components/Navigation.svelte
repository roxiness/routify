<script>
    import { node, isActive, url } from '@roxi/routify'

    const icons = {
        home: 'fas fa-heart',
        explore: 'fas fa-compass',
        guide: 'fas fa-graduation-cap',
    }
</script>

<nav>
    {#each $node.linkableChildren as { name, path }}
        <a href={$url(path)} class:is-active={$isActive(path)} class="nav-button {name}">
            <i class="icon {icons[name]}" />
            <div class="text">
                {name}
            </div>
        </a>
    {/each}
</nav>

<style>
    nav {
        justify-content: space-evenly;
        height: 100px;
        align-items: center;
        padding: 4px 0 0 0;
        box-shadow: 0 34px 30px 20px rgba(0, 0, 0, 1),
            0 34px 30px 20px rgba(255, 255, 255, 1);
    }

    .nav-button {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
        color: var(--muted-color);
        text-transform: capitalize;
        font-weight: 500;
        line-height: 1;
    }
    .icon {
        font-size: 24px;
    }
    a.is-active {
        color: var(--contrast);
    }
    a:hover {
        --background-color: none;
    }
</style>
