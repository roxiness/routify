<script>
    import { url } from '@roxi/routify'
    const urls = {
        plain: $url('../plain'),
        dynamic: $url('../[country]-[language]/[post]', {
            country: 'UK',
            language: 'en',
            post: 'Hello World',
        }),
        overload: $url('../[country]-[language]/[post]', {
            country: 'UK',
            language: 'en',
            post: 'Hello World',
            theme: 'dark',
            author: 'john doe',
        }),
    }
</script>

<a href={urls.plain}>{urls.plain}</a>
<a href={urls.dynamic}>{urls.dynamic}</a>
<a href={urls.overload}>{urls.overload}</a>

<style>
    a {
        display: block;
    }
</style>
