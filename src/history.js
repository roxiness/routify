module.exports = function(routes, cb) {

    ['pushState', 'replaceState'].forEach(eventName => {
        const fn = history[eventName]
        history[eventName] = function(state, title, url) {
            const event = Object.assign(new Event(eventName.toLowerCase(), { state, title, url }))
            Object.assign(event, { state, title, url })

            fn.apply(this, [state, title, url])
            return dispatchEvent(event)
        }
    })

    function click(event) {
        const tag = event.target.closest('a')
        const href = tag && tag.getAttribute('href')

        if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || event.button || event.defaultPrevented) return;
        if (!href || tag.target || tag.host !== location.host) return;

        event.preventDefault();
        history.pushState({}, '', href)
    }


    addEventListener('popstate', updatePage);
    addEventListener('replacestate', updatePage);
    addEventListener('pushstate', updatePage);
    addEventListener('click', click);


    function updatePage({ url }) {
        const urlWithIndex = url.match(/\/index\/?$/) ?
            url :
            (url + "/index").replace(/[\/]+/, "/"); //remove duplicate slashes

        let route =
            routes.filter(route => urlWithIndex.match(route.regex))[0] ||
            routes.filter(route => url.match(route.regex))[0];

        const components = [...route.layouts, route.component];

        const params = {};
        if (route.paramKeys) {
            url.match(route.regex).forEach((match, i) => {
                if (i === 0) return;
                const key = route.paramKeys[i];
                params[key] = match;
            });
        }

        route = { ...route, params };
        cb({ components, route })
    }
}