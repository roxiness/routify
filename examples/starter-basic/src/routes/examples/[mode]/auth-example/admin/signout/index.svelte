<script context="module">
    import { auth } from '../../__store'

    export const load = () => {
        auth.signout()
        return { redirect: '/examples/auth-example/admin' }
    }
</script>
