<script context="module">
    export const load = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        return { props: { date: new Date() } }
    }
</script>

<script>
    import { beforeUrlChange } from '@roxi/routify'
    export let date
    $beforeUrlChange(() => true)
</script>

Date: {date}
