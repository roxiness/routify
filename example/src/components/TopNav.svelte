<script>
    import Icon from '#cmp/Icon.svelte'
    import { Sticky } from 'polykit'
</script>

<Sticky --z-index="1" boundary={{ top: 0 }} let:stuck>
    <nav class:stuck>
        <div class="container">
            <img class="brand" src="/assets/routify3.svg" />
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
</Sticky>

<style>
    nav {
        height: var(--spacing-8);
        align-items: center;
        display: flex;
        background: white;
        border-bottom: solid 1px white;
    }
    nav.stuck {
        box-shadow: 0 0 18px -3px rgba(0, 0, 0, 0.2);
        border-bottom: solid 1px #ddd;
    }

    .brand {
        height: 56px;
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
        padding-left: var(--spacing-8);
        align-items: center;
    }
    .middle a {
        font-size: 20px;
        color: var(--color-grey-700);
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 var(--spacing-2);
        /* font-weight: 500; */
    }
    .middle a:first-of-type {
        margin-left: 0;
    }
    .middle a.icon {
        opacity: 0.5;
        padding: 0;
        margin: 0 8px;
    }
    .middle a:hover {
        opacity: 1;
    }
</style>
