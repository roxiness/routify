<script context="module">
    export const load = () => ({})
</script>

<script>
    let multi = false
    export let context
    console.log('ctx', context)
</script>

<div class="blog">
    <header>
        <nav>
            <a href="/blog">home</a>
            <a href="/blog/page1">page1</a>
            <a href="/blog/page2">page2</a>
            <a href="/blog/page3">page3</a>
        </nav>
        <label>
            Render siblings
            <input type="checkbox" bind:checked={multi} />
        </label>
    </header>

    <main>
        <slot {multi} />
    </main>
</div>

<style>
    header {
        position: absolute;
        background: white;
        width: 100%;
        border-bottom: 1px solid #ccc;
        font-size: 110%;
        top: 48px;
    }
    nav {
        line-height: 48px;
        vertical-align: middle;
    }
    div {
        padding-top: 96px;
        height: 100vh;
    }
    main {
        /* top: 96px; */
        /* position: fixed; */
        /* height: 100%; */
        overflow: auto;
    }
    nav,
    label {
        display: inline-block;
    }
</style>
