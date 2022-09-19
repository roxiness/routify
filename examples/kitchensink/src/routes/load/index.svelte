<script context="module">
    export const load = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        return { props: { date: new Date() } }
    }
</script>

<script>
    export let date
</script>

Date: {date}
