<script context="module">
    import { auth } from '@/store'

    export const load = ctx => {
        const user = auth.get()
        if (ctx.route.meta.isProtected && user.isGuest)
            return { redirect: '/admin/login' }
    }
</script>

<!-- todo check load return values. Error, maxage, status etc -->
<!-- routify:meta order=2 -->
<!-- routify:meta reset -->
<!-- routify:meta isProtected=true -->

{#if !$auth.isGuest}
    <a class="signout" href="/admin/signout">signout</a>
{/if}
<span class="return-link">
    <a href="/">Return to front page</a>
</span>

<slot />
