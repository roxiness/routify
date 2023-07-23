<script context="module">
    import { auth } from '../../__store'

    export const load = ctx => {
        auth.signout()
        return { redirect: ctx.url('..') }
    }
</script>
