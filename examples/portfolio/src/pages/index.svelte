<script context="module">
    import { url, goto } from '@roxi/routify'
    export const guard = route => {
        console.log(route.router.url.replace('/home'))
        // route.router.url('/home')
    }
</script>
