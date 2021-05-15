<script>
    import decorator from './_miniBrowser.svelte'
    import { Router } from '@roxi/routify'
</script>

<h1>Multi router</h1>

<div class="split">
    <div class="left">
        <Router name="left" {decorator} />
    </div>

    <div class="right">
        <Router name="right" {decorator} />
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
