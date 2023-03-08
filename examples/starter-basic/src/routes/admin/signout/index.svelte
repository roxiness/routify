<script context="module">
    import { auth } from '@/store'

    export const load = () => {
        auth.signout()
        return { redirect: '/admin' }
    }
</script>
