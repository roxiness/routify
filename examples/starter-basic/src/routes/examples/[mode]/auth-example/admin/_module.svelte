<script context="module">
    import { url } from '@roxi/routify'
    import { auth } from '../__store'

    export const load = ctx => {
        const user = auth.get()
        if (ctx.route.meta.isProtected && user.isGuest)
            return { redirect: ctx.url('./signin') }
    }
</script>

<!-- todo check load return values. Error, maxage, status etc -->
<!-- routify:meta order=2 -->
<!-- routify:meta NOreset -->
<!-- routify:meta isProtected=true -->

{#if !$auth.isGuest}
    <a class="signout" href={$url('./signout')}>signout</a>
{/if}

<slot />
