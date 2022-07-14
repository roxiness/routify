<script>
    import { writable } from 'svelte/store'
    import { RouteFragment } from '../Route/RouteFragment'
    import RenderFragment from './RenderFragment.svelte'
    import { normalizeMulti } from './utils'

    /** @type {RouteFragment[]}*/
    export let fragments
    export let options = {}

    const { multi, decorator, props } = options

    const normalizedMulti = normalizeMulti(multi, fragments[0].node)

    console.log('rrroute', fragments[0].route, multi)

    const getFirstPage = node =>
        node.traverse('./index', null, null, true) || node.pages[0]

    /** @type {import('./types').RenderContext[] }*/
    const renderContexts = normalizedMulti.pages.map(node => ({
        restFragments: getFirstPage(node)
            ? writable([
                  new RouteFragment(fragments[0].route, getFirstPage(node), null, {}),
              ])
            : writable([]),
        node,
        fragment: null,
        isActive: writable(false),
        route: fragments[0].route,
    }))

    $: single = !options.multi

    $: console.log('OOOPTIONS', renderContexts)

    /**
     *
     * @param {RouteFragment[]} fragments
     */
    const handlePageChange = fragments => {
        const [fragment, ...restFragments] = [...fragments]
        // console.log('page change', fragment.node.id, restFragments)
        try {
            const activeSibling = renderContexts.find(sib => sib.node === fragment.node)
            activeSibling.fragment = fragment
            activeSibling.restFragments.set(restFragments)
            activeSibling.route = fragments[0].route
            // set this sibling to active and all other to inactive
            renderContexts.forEach(s =>
                s.isActive.set(
                    s === activeSibling &&
                        activeSibling.route.allFragments.includes(s.fragment),
                ),
            )
        } catch (err) {
            console.error(
                'could not get active sibling for',
                fragment,
                '\r\nPool:',
                renderContexts,
            )
            throw new Error('Rendering route failed.')
        }
    }

    $: handlePageChange(fragments)
</script>

{#each renderContexts as context (context.node.id)}
    <RenderFragment {context} {single} {decorator} {props} />
{/each}
