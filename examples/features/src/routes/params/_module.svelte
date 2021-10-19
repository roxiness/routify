<script>
    import { url, params, activeRoute } from '@roxi/routify'
    $: console.log($activeRoute)
</script>

<ul>
    <li><a href={$url('./[id]', { id: 'foo' })}>id: foo</a></li>
</ul>

<slot />

<pre>{JSON.stringify($params, null, 2)}</pre>
