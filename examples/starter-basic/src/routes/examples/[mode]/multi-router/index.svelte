<script>
    import { Router, node } from '@roxi/routify'
    const rootNode = $node.traverse('../_card')
</script>

<div data-routify-scroll-lock>
    <Router {rootNode} />
    <Router {rootNode} />
    <Router {rootNode} />
    <Router {rootNode} />
</div>

<style>
    div {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 1rem;
        margin-inline: 1rem;
        margin-top: 1rem;
    }
    :global(.button) {
        display: inline-block;
        padding: 5px 10px;
        margin: 5px;
        background: var(--surface-1);
        color: var(--text-1);
        text-decoration: none;
        border-radius: 5px;
    }
</style>
