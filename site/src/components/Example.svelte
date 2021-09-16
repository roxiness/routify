<script>
    import { Details } from 'polykit'
    import { resolveNode } from '@roxi/routify'
    import FilesViewer from '#cmp/FilesViewer.svelte'
    import Browser from '#cmp/minibrowser/MiniBrowser.svelte'
    export let path
    export let title
    export let focus = null
    export let show = false
</script>

<Details {show}>
    <button slot="activator">Show example</button>
    <div class="example">
        <h4>{title}</h4>
        <div class="left-bar" />
        <div class="fv">
            <FilesViewer root={resolveNode(path)} {focus} />
        </div>
        <div class="ex">
            <Browser offset={path} slot="browser" />
        </div>
    </div>
</Details>

<style>
    .example {
        position: relative;
        margin-bottom: 96px;
    }
    .left-bar {
        position: absolute;
        width: 16px;
        top: 16px;
        bottom: -16px;
        left: -40px;

        border-left: 4px solid var(--color-grey-300);
        border-top: 4px solid var(--color-grey-300);
        border-bottom: 4px solid var(--color-grey-300);
        border-bottom-left-radius: 16px;
        border-top-left-radius: 16px;
    }
    h4 {
        margin: 16px 0 16px;
        padding-bottom: 1rem;
        font-weight: bold;
    }
    .fv {
        padding-bottom: 32px;
    }
</style>
