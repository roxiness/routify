import { matchRoute } from './utils'
import * as store from './store'

export default function (routes, cb) {
    addEventListener('popstate', updatePage);
    addEventListener('replacestate', updatePage);
    addEventListener('pushstate', updatePage);
    addEventListener('click', click);

    // create events for pushState and replaceState
    ['pushState', 'replaceState'].forEach(eventName => {
        const fn = history[eventName]
        history[eventName] = function(state, title, url) {
            const event = Object.assign(new Event(eventName.toLowerCase(), { state, title, url }))
            Object.assign(event, { state, title, url })

            fn.apply(this, [state, title, url])
            return dispatchEvent(event)
        }
    })

    function updatePage() {
        const match = matchRoute(location.pathname, routes);
        const route = { ...match.route, params: match.params };
        const components = [...route.layouts, route.component];

        //run callback in Router.svelte
        cb({ components, route })
    }
    updatePage()

    function click(event) {
        const el = event.target.closest('a')
        const href = el && el.getAttribute('href')

        if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || event.button || event.defaultPrevented) return;
        if (!href || el.target || el.host !== location.host) return;

        event.preventDefault();
        history.pushState({}, '', href)
    }
}
