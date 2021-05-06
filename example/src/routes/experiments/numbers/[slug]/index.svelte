<script>
    import Router from '@roxi/routify/lib/runtime/Router.svelte'

    export let payload
    export let options
    let subRoutes = []
    const { instance } = payload
    console.log('pl', payload)
    // console.log(payload.route)
</script>

<h1>
    {payload.route.params.slug}
</h1>

<!-- <Router /> -->
<a href="/experiments/numbers/105">105</a>
