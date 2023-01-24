<script>
    import { url } from '@roxi/routify'
    import FrontpageBlock from './__decorators/FrontpageBlock.svelte'
</script>

<nav>
    <a href={$url('./')}>Home</a>
    <a href={$url('./hero')}>Hero</a>
    <a href={$url('./features')}>Features</a>
</nav>

<slot
    multi={{ renderInactive: 'browser' }}
    decorator={{ component: FrontpageBlock, recursive: false }} />
<!-- routify:meta reset=true -->
