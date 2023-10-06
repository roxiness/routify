<script context="module">
    /**
     * the module load runs before the component is created
     * it's a good place to load data that the component needs
     * to render. The data is then passed to the component
     * through props.
     *
     * Since we have history enabled, the load function will
     * only run once if the user navigates away and then back.
     * If history is disabled, the load function will run
     * every time the user visits the page.
     */
    export const load = ctx => ({ props: { date: new Date() } })
</script>

<script>
    import { url } from '@roxi/routify'
    // allow the date prop to be passed from the module
    export let date
</script>

<!-- routify:meta history -->

<div>
    <h3>You visited this page at</h3>
    <h1>
        {date?.toLocaleTimeString() || 'never'}
    </h1>
    <h3>
        <a href={$url('.')}>Revisit</a>
    </h3>
</div>

<style>
    div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
    }
</style>
