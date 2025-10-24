<!-- routify:meta history -->
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
    let counter = 1
    export const load = () => ({ props: { count: counter++ } })
</script>

<script>
    import { url } from '@roxi/routify'
    export let count = 0
</script>

<div>
    <h4>Visit counter</h4>
    <h1>{count}</h1>
    <a class="button" href={$url('.')}>Revisit</a>
</div>

<style>
    div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
    }
    /* change color on mouse down */
    a:active {
        color: #dfe2e6;
    }
    .button {
        margin-top: 1rem;
        text-align: center;
        background-color: #eee;
        border: none;
        padding: 0.7rem;
        font-size: 0.7rem;
        font-weight: bold;
        width: 8em;
        border-radius: 1rem;
        color: var(--pink-4);
        box-shadow: 0 0.4rem #dfd9d9;

        cursor: pointer;
    }

    .button:active {
        color: white;
        box-shadow: 0 0.2rem #dfd9d9;
        transform: translateY(0.2rem);
    }

    .button:hover:not(:disabled) {
        background: var(--pink-4);
        color: white;
        text-shadow: 0 0.1rem #bcb4b4;
    }

    .button:disabled {
        cursor: auto;
        color: grey;
    }
</style>
