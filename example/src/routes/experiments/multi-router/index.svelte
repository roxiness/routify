<script>
    import MiniBrowser from '#cmp/minibrowser/MiniBrowser.svelte'
    import { Router } from '@roxi/routify'
</script>

<h1>Multi router</h1>

<div class="split">
    <div class="left">
        <Router name="left" decorator={MiniBrowser} />
    </div>

    <div class="right">
        <Router name="right" decorator={MiniBrowser} />
    </div>
</div>

<style>
    .split {
        display: flex;
    }
    .split > * {
        flex-grow: 1;
        flex-basis: 0;
        margin: 0 16px;
    }
</style>
