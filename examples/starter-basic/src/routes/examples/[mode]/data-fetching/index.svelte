<script>
    import { url } from '@roxi/routify'
</script>

<p>
    This example demonstrates how to utilize the `load` hook to fetch and return data via
    a "props" object. Navigate to data.svelte to see how we retrieve data from a Star Wars
    API and make it accessible for our component.
</p>

<a href={$url('../data')} data-routify-prefetch-data="hover">prefetch data on hover</a>
