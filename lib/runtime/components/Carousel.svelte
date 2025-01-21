<script>
    /**
     * Carousel component
     * @description A component that allows you to scroll through a node's inlined children
     */

    import { RouteOnScroll } from '../helpers/dedicated/RouteOnScroll/index.js'
    /** @type {ConstructorParameters<typeof RouteOnScroll>['0']}*/
    export let options = { direction: 'horizontal' }

    const routeOnScroll = new RouteOnScroll({
        scrollEvent: 'scroll', // or "scrollend"
        threshold: 100, // don't trigger until we're within 100px of the page
        direction: 'horizontal',
        strategy: 'withinThreshold',
        ...options,
    })
</script>

<div
    class={$$props.class}
    data-routify-carousel={routeOnScroll.direction}
    data-routify-scroll-lock
    use:$routeOnScroll>
    <slot />
</div>

<style>
    /**
    *    Scroll snap
    */
    [data-routify-carousel] {
        display: grid;
        overflow: auto;
        scroll-behavior: smooth;
        scrollbar-width: none;
        &::-webkit-scrollbar {
            display: none;
        }
    }
    [data-routify-carousel] > :global(*) {
        scroll-snap-align: start;
    }
    [data-routify-carousel='horizontal'] {
        grid-auto-flow: column;
        grid-auto-columns: 100%;
        scroll-snap-type: x mandatory;
    }
    [data-routify-carousel='vertical'] {
        grid-auto-flow: row;
        grid-auto-rows: 100%;
        scroll-snap-type: y mandatory;
    }
</style>
