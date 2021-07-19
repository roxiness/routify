<script>
    import { url } from '@roxi/routify'
    $: console.log('UUUUURL', $url('../a/page'))
    $: u = $url('../a/page')
</script>

<h1>Welcome to SvelteKit + Routify</h1>
<!-- {$url('../a/page')} -->
<a href={u}>a page</a>
