<script>
    import Icon from '#cmp/Icon.svelte'
</script>

<nav>
    <div class="container">
        <img src="/assets/routify3.svg" height="56px" />
        <div class="middle">
            <a href="https://github.com/roxiness/routify">
                <Icon name="IconGithub" />
            </a>
            <a href="https://discord.gg/ntKJD5B">
                <Icon name="IconDiscord" />
            </a>
            <a href="https://twitter.com/routifyjs">
                <Icon name="IconTwitter" />
            </a>
        </div>
    </div>
</nav>

<style>
    nav {
        height: var(--spacing-8);
        box-shadow: 0 0 16px rgba(0, 0, 0, 0.1);
        border-bottom: solid 1px #ddd;
        align-items: center;
        display: flex;
    }
    .container {
        grid-template-columns: var(--left-nav) auto;
        display: grid;
    }
    .middle {
        display: flex;
        padding-left: calc(var(--spacing-8) - 12px);
        align-items: center;
    }
    .middle a {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .middle a {
        opacity: 0.5;
        width: 48px;
        height: 48px;
    }
    .middle a:hover {
        opacity: 1;
    }
</style>
