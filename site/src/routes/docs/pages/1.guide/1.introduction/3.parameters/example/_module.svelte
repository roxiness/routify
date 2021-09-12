<script>
    import { url } from '@roxi/routify'
</script>

<a href="/">Home</a>
<a href={$url('/[post]', { post: 'hello', foo: 'bar' })}>single param</a>
<a href={$url('/[year]-[movie]', { year: '1991', movie: 'Terminator' })}
    >combined param</a>
<!-- <a href={$url('/[...spread]', { spread: ['foo', 'bar', 'baz'] })}>spreads</a> -->
<a href="/foo/bar/baz">spreads2</a>

<slot />
