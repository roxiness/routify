import * as store from './store'

export default function (routes, cb) {
    const fallbacks = routes.filter(route => route.isFallback)
    routes = routes.filter(route => !route.isFallback)

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
        const url = window.location.pathname
        const urlWithIndex = url.match(/\/index\/?$/) ?
            url :
            (url + "/index").replace(/\/+/g, "/"); //remove duplicate slashes

        let route =
            routes.filter(route => urlWithIndex.match(route.regex))[0]
            || routes.filter(route => url.match(route.regex))[0]
            || fallbacks.filter(route => url.match(route.regex))[0]

        if (!route) throw new Error(`Route could not be found. Make sure ${url}.svelte or ${url}/index.svelte exists. A restart may be required.`)


        const components = [...route.layouts, route.component];

        const regexUrl = route.regex.match(/\/index$/) ? urlWithIndex : url

        const params = {};
        if (route.paramKeys) {
            regexUrl.match(route.regex).forEach((match, i) => {
                if (i === 0) return;
                const key = route.paramKeys[i - 1];
                params[key] = match;
            });
        }

        route.params = params

        //set the route in the store
        store.route.set(route)

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
