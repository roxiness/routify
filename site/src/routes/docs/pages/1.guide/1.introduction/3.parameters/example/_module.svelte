<script>
    import { url } from '@roxi/routify'

    // returns /hello?theme=dark
    $: url1 = $url('/[post]', {
        post: 'hello',
        theme: 'dark',
    })

    // returns /1991-Terminator
    $: url2 = $url('/[year]-[movie]', {
        year: '1991',
        movie: 'Terminator',
    })
</script>

<a href="/">Home</a>
<a href={url1}>post</a>
<a href={url2}>movie</a>

<slot />
