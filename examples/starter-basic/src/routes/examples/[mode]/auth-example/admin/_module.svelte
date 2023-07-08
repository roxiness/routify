<script context="module">
    import { url } from '@roxi/routify'
    import { auth } from '../__store'

    export const load = ctx => {
        const user = auth.get()
        if (ctx.route.meta._isProtected && user.isGuest)
            return { redirect: ctx.url('./signin') }
    }
</script>

<!-- todo check load return values. Error, maxage, status etc -->
<!-- routify:meta order=2 -->
<!-- routify:meta _isProtected=true -->

{#if !$auth.isGuest}
    <a class="signout" href={$url('./signout')}>signout</a>
{/if}

<slot />
