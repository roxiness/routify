<script>
    let windowWidth = 0
    export let defaultStateMobile = 'closed'
    export let defaultStateDesktop = 'open'
    export let breakpoint = 1024
    export let open = null
    export let state = ''
    export let screenSize = ''
    $: screenSize = windowWidth > breakpoint ? 'desktop' : 'mobile'
    $: defaultState = screenSize === 'desktop' ? defaultStateDesktop : defaultStateMobile
    $: open = defaultState === 'open' // update open state if the screen size changes
    $: state = open ? 'open' : 'closed'
</script>

<svelte:window bind:innerWidth={windowWidth} />

<slot open={state === 'open'} {screenSize} {state} />
