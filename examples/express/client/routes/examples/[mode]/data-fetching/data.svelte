<script context="module">
    /**
     *  The "load" hook in Routify runs before a component loads and can return data via a "props" object.
     *  @param {RoutifyLoadContext} ctx */
    export const load = async ({ fetch }) => {
        // let's simulate a slow network
        await new Promise(resolve => setTimeout(resolve, 500))

        return {
            props: {
                luke: await fetch('https://swapi.dev/api/people/1').then(res =>
                    res.json(),
                ),
            },
        }
    }
</script>

<script>
    export let luke
</script>

<pre>
{JSON.stringify(luke, null, 2)}
</pre>
