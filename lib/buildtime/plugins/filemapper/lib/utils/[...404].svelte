<script context="module">
    export const load = ({ route }) => ({
        status: 404,
        error: '[Routify] Page could not be found.',
        props: { url: route.url },
    })
</script>

<script>
    export let url
</script>

<!-- This file was created by Routify.
     To customize the error page, create a catchall page 
     in the root of your project. Eg. [...404].svelte -->
404 - Could not find the page "{url}"
