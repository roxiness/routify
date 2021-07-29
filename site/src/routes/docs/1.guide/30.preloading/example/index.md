<script context="module">
    export const load = async () => {
        //simulate slow api
        await new Promise(resolve => setTimeout(resolve, 1500))
        return {
            hello: await 'preloaded world',
        }
    }
</script>

<script>
    export let hello
</script>


hello {hello}