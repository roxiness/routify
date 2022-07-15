<script>
    let multi = true
</script>

<div id="app">
    <header>
        <nav>
            <a href="/blog">blog</a>
            <a href="/welcome">welcome</a>
            <a href="/about">about</a>
        </nav>
        <label for="">
            Render siblings
            <input type="checkbox" bind:checked={multi} />
        </label>
    </header>
    <main>
        <slot {multi} />
    </main>
</div>

<style>
    #app {
        height: 100vh;
        background: yellow;
        display: grid;
        grid-template-rows: auto 1fr;
    }
    header {
        background: white;
        border-bottom: 1px solid #ccc;
        font-size: 110%;
    }
    nav {
        line-height: 48px;
        vertical-align: middle;
    }
    main {
        background: red;
        overflow: auto;
    }
    nav,
    label {
        display: inline-block;
    }
    main {
        display: flex;
    }
    main > :global(.decorator) {
        background: yellow;
        /* width: 50%; */
    }
</style>
