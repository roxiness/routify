<script>
    import Wrapper from './Wrapper.svelte'
    export let defaultStateMobile = 'closed'
    export let defaultStateDesktop = 'open'
    export let breakpoint = 1024
    export let desktop = 'shrink'
    export let mobile = 'slide'
    export let screenSize = ''
    export let state = ''
    export let open = false
    let loading = 'loading'
    $: transform = !open ? '' : screenSize === 'desktop' ? desktop : mobile
    $: returnProps = { screenSize, state, open, loading, transform }
    setTimeout(() => (loading = ''))
</script>

<Wrapper
    bind:open
    bind:screenSize
    bind:state
    {defaultStateMobile}
    {defaultStateDesktop}
    {breakpoint}>
    <div class="polykit-sidenav-container {loading} {screenSize} {state} {transform} ">
        <!-- Main -->
        <main>
            <slot {...returnProps} />
        </main>

        <!-- Aside -->
        <aside>
            <slot name="aside" {...returnProps} />
        </aside>
        <button on:click={() => (open = !open)}>{open ? 'close' : 'open'}</button>
    </div>
</Wrapper>

<style>
    /************
     *  SHARED  *
     ************/
    .polykit-sidenav-container {
        position: relative;
        display: flex;
        overflow-x: hidden;
        height: 100%;
    }

    aside,
    main,
    button {
        transition: 0.4s all;
    }
    .loading * {
        transition: none !important;
    }

    /************
     *  BUTTON  *
     ************/

    button {
        position: absolute;
        left: calc(var(--left-nav) - 100px);
    }
    .closed button {
        left: 10px;
    }

    /***********
     *  ASIDE  *
     ***********/

    aside {
        position: absolute;
        background: #fafafa;
        top: 0;
        left: 0;
        width: var(--left-nav);
        min-height: 100%;
    }
    .closed aside {
        transform: translateX(calc(-1 * var(--left-nav)));
    }

    /**********
     *  MAIN  *
     **********/
    main {
        width: 100%;
        min-height: 100%;
        display: flex;
    }

    .open.desktop.shrink main {
        margin-left: var(--left-nav);
    }
    .open.mobile.shrink main {
        margin-left: var(--left-nav);
    }
    .open.desktop.slide main {
        transform: translateX(var(--left-nav));
    }
    .open.mobile.slide main {
        transform: translateX(var(--left-nav));
    }
</style>
