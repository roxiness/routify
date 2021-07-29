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

## Load
Routify can execute calls prior to loading components. This can be done with `load` as shown below.

```html
<script context="module">
    export const load = async () => {
        //simulate slow api
        await new Promise(resolve => setTimeout(resolve, 1500))
        return {
            hello: 'preloaded world',
        }
    }
</script>

<script>
    export let hello
</script>

hello {hello}
```

### Example
hello {hello}