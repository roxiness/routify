<script context="module">
    export const load = async () => ({
        hello: await 'preloaded world',
    })
</script>

<script>
    export let hello
</script>

hello {hello}
