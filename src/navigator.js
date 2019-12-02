import { getContext, setContext } from 'svelte';
import { matchRoute } from './utils';
import * as stores from './store';

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

function handleClick(event) {
    const el = event.target.closest('a')
    const href = el && el.getAttribute('href')

    if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || event.button || event.defaultPrevented) return;
    if (!href || el.target || el.host !== location.host) return;

    event.preventDefault();
    history.pushState({}, '', href)
}

addEventListener('click', handleClick);

function startDOMListeners(handler) {
    if (!handler) return;
    addEventListener('popstate', handler);
    addEventListener('replacestate', handler);
    addEventListener('pushstate', handler);
}

function stopDOMListeners(handler) {
    if (!handler) return;
    removeEventListener('popstate', handler);
    removeEventListener('replacestate', handler);
    removeEventListener('pushstate', handler);
}

function RouterContext() {
    if (!(this instanceof RouterContext)) {
        return new RouterContext();
    }

    const handlers = [];

    this.update = () => {
        this.match = !this.routes ? void 0 : (
            matchRoute(location.pathname, this.routes)
        );

        this.route = !this.match ? void 0 : {
            ...this.match.route,
            params: this.match.params
        };

        stores.route.set(this.route);

        for (let i = 0, len = handlers.length; i < len; i++) {
            const { [i]: handler } = handlers;
            handler.call(this, this);
        }

        return this;
    };

    this.subscribe = handler => {
        if (!handlers.length) startDOMListeners(this.update);
        if (handlers.indexOf(handler) < 0) {
            handlers.push(handler);
            this.update();
        }
        
        return ()=> {
            const handlerIndex = handlers.indexOf(handler);
            if (handlerIndex >= 0) handlers.splice(handlerIndex, 1);
            if (!handlers.length) stopDOMListeners(this.update);
        }
    };
}

export default function(config) {
    let context = getContext(RouterContext);

    if (!context) {
        context = new RouterContext();
        setContext(RouterContext, context);
    }

    return !arguments.length ? context : (
        Object.assign(context, config).update()
    );
}