<script>
    import Icon from '#cmp/Icon.svelte'
</script>

<nav>
    <div class="container">
        <img src="/assets/routify3.svg" height="56px" />
        <div class="middle">
            <a href="/docs">Docs</a>
            <a href="/blog">Blog</a>
            <div class="spacer" />
            <a href="https://github.com/roxiness/routify" class="icon">
                <Icon name="IconGithub" />
            </a>
            <a href="https://discord.gg/ntKJD5B" class="icon">
                <Icon name="IconDiscord" />
            </a>
            <a href="https://twitter.com/routifyjs" class="icon">
                <Icon name="IconTwitter" />
            </a>
        </div>
        <div
            class="right"
            style="text-align: right; font-weight: bold; color: var(--color-grey-500)">
            <Icon name="IconSearch" />
            Search...
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
    .spacer {
        width: var(--spacing-4);
    }
    .container {
        grid-template-columns: var(--left-nav) auto auto;
        display: grid;
    }
    .middle {
        display: flex;
        padding-left: calc(var(--spacing-8) + var(--spacing-2));
        align-items: center;
    }
    .middle a {
        font-size: 20px;
        color: var(--color-grey-700);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 var(--spacing-2);
        /* font-weight: 500; */
    }
    .middle a.icon {
        opacity: 0.5;
        width: 48px;
        height: 48px;
    }
    .middle a:hover {
        opacity: 1;
    }
</style>
