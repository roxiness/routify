
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    /**
     * Hot module replacement for Svelte in the Wild
     *
     * @export
     * @param {object} Component Svelte component
     * @param {object} [options={ target: document.body }] Options for the Svelte component
     * @param {string} [id='hmr'] ID for the component container
     * @param {string} [eventName='app-loaded'] Name of the event that triggers replacement of previous component
     * @returns
     */
    function HMR(Component, options = { target: document.body }, id = 'hmr', eventName = 'app-loaded') {
        const oldContainer = document.getElementById(id);

        // Create the new (temporarily hidden) component container
        const appContainer = document.createElement("div");
        if (oldContainer) appContainer.style.visibility = 'hidden';
        else appContainer.setAttribute('id', id); //ssr doesn't get an event, so we set the id now

        // Attach it to the target element
        options.target.appendChild(appContainer);

        // Wait for the app to load before replacing the component
        addEventListener(eventName, replaceComponent);

        function replaceComponent() {
            if (oldContainer) oldContainer.remove();
            // Show our component and take over the ID of the old container
            appContainer.style.visibility = 'initial';
            // delete (appContainer.style.visibility)
            appContainer.setAttribute('id', id);
        }

        return new Component({
            ...options,
            target: appContainer
        });
    }

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function claim_element(nodes, name, attributes, svg) {
        for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i];
            if (node.nodeName === name) {
                let j = 0;
                while (j < node.attributes.length) {
                    const attribute = node.attributes[j];
                    if (attributes[attribute.name]) {
                        j++;
                    }
                    else {
                        node.removeAttribute(attribute.name);
                    }
                }
                return nodes.splice(i, 1)[0];
            }
        }
        return svg ? svg_element(name) : element(name);
    }
    function claim_text(nodes, data) {
        for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i];
            if (node.nodeType === 3) {
                node.data = '' + data;
                return nodes.splice(i, 1)[0];
            }
        }
        return text(data);
    }
    function claim_space(nodes) {
        return claim_text(nodes, ' ');
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                info.blocks[i] = null;
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function fix_and_outro_and_destroy_block(block, lookup) {
        block.f();
        outro_and_destroy_block(block, lookup);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next, lookup.has(block.key));
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error(`Cannot have duplicate keys in a keyed each`);
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function claim_component(block, parent_nodes) {
        block && block.l(parent_nodes);
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.22.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe,
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const MATCH_PARAM = RegExp(/\:([^/()]+)/g);

    function handleScroll(element) {
      if (navigator.userAgent.includes('jsdom')) return false
      scrollAncestorsToTop(element);
      handleHash();
    }

    function handleHash() {
      if (navigator.userAgent.includes('jsdom')) return false
      const { hash } = window.location;
      if (hash) {
        const el = document.querySelector(hash);
        if (hash && el) el.scrollIntoView();
      }
    }

    function scrollAncestorsToTop(element) {
      if (
        element &&
        element.scrollTo &&
        (element.dataset.routify !== 'scroll-lock'
          || element.dataset['routify-scroll'] !== 'lock')
      ) {
        element.style['scroll-behavior'] = "auto";
        element.scrollTo({ top: 0, behavior: 'auto' });
        element.style['scroll-behavior'] = "";
        scrollAncestorsToTop(element.parentElement);
      }
    }

    const pathToRegex = (str, recursive) => {
      const suffix = recursive ? '' : '/?$'; //fallbacks should match recursively
      str = str.replace(/\/_fallback?$/, '(/|$)');
      str = str.replace(/\/index$/, '(/index)?'); //index files should be matched even if not present in url
      str = str.replace(MATCH_PARAM, '([^/]+)') + suffix;
      return str
    };

    const pathToParams = string => {
      const params = [];
      let matches;
      while (matches = MATCH_PARAM.exec(string))
        params.push(matches[1]);
      return params
    };

    const pathToRank = ({ path }) => {
      return path
        .split('/')
        .filter(Boolean)
        .map(str => (str === '_fallback' ? 'A' : str.startsWith(':') ? 'B' : 'C'))
        .join('')
    };

    let warningSuppressed = false;

    /* eslint no-console: 0 */
    function suppressWarnings() {
      if (warningSuppressed) return
      const consoleWarn = console.warn;
      console.warn = function (msg, ...msgs) {
        const ignores = [
          "was created with unknown prop 'scoped'",
          "was created with unknown prop 'scopedSync'",
        ];
        if (!ignores.find(iMsg => msg.includes(iMsg)))
          return consoleWarn(msg, ...msgs)
      };
      warningSuppressed = true;
    }


    function currentLocation(){
      const pathMatch = window.location.search.match(/__routify_path=([^&]+)/);
      const prefetchMatch = window.location.search.match(/__routify_prefetch=?[^&]*/);
      window.routify = window.routify || {};
      window.routify.prefetched = prefetchMatch ? true : false;
      const path = pathMatch && pathMatch[1];
      return path || window.location.pathname
    }

    /** @type {import('svelte/store').Writable<RouteNode>} */
    const route = writable(null); // the actual route being rendered

    /** @type {import('svelte/store').Writable<RouteNode[]>} */
    const routes = writable([]); // all routes

    let rootContext = writable({ component: { params: {} } });

    /** @type {import('svelte/store').Writable<RouteNode>} */
    const urlRoute = writable(null);  // the route matching the url

    /** @type {import('svelte/store').Writable<String>} */
    const basepath = (() => {
        const { set, subscribe } = writable("");

        return {
            subscribe,
            set(value) {
                if (value.match(/^\//))
                    set(value);
                else console.warn('Basepaths must start with /');
            },
            update() { console.warn('Use assignment or set to update basepaths.'); }
        }
    })();

    const location$1 = derived( // the part of the url matching the basepath
        [basepath, urlRoute],
        ([$basepath, $route]) => {
            const [, base, path] = currentLocation().match(`^(${$basepath})(${$route.regex})`) || [];
            return { base, path }
        }
    );

    const prefetchPath = writable("");

    var defaultConfig = {
        queryHandler: {
            parse: search => fromEntries(new URLSearchParams(search)),
            stringify: params => '?' + (new URLSearchParams(params)).toString()
        }
    };


    function fromEntries(iterable) {
        return [...iterable].reduce((obj, [key, val]) => {
            obj[key] = val;
            return obj
        }, {})
    }

    /**
     * @param {string} url 
     * @return {ClientNode}
     */
    function urlToRoute(url) {
        /** @type {RouteNode[]} */
        const routes$1 = get_store_value(routes);
        const basepath$1 = get_store_value(basepath);
        const route = routes$1.find(route => url.match(`^${basepath$1}${route.regex}`));
        if (!route)
            throw new Error(
                `Route could not be found. Make sure ${url}.svelte or ${url}/index.svelte exists. A restart may be required.`
            )

        const [, base, path] = url.match(`^(${basepath$1})(${route.regex})`);

        if (defaultConfig.queryHandler)
            route.params = defaultConfig.queryHandler.parse(window.location.search);

        if (route.paramKeys) {
            const layouts = layoutByPos(route.layouts);
            const fragments = path.split('/').filter(Boolean);
            const routeProps = getRouteProps(route.path);

            routeProps.forEach((prop, i) => {
                if (prop) {
                    route.params[prop] = fragments[i];
                    if (layouts[i]) layouts[i].param = { [prop]: fragments[i] };
                    else route.param = { [prop]: fragments[i] };
                }
            });
        }

        route.leftover = url.replace(new RegExp(base + route.regex), '');

        return route
    }


    /**
     * @param {array} layouts
     */
    function layoutByPos(layouts) {
        const arr = [];
        layouts.forEach(layout => {
            arr[layout.path.split('/').filter(Boolean).length - 1] = layout;
        });
        return arr
    }


    /**
     * @param {string} url
     */
    function getRouteProps(url) {
        return url
            .split('/')
            .filter(Boolean)
            .map(f => f.match(/\:(.+)/))
            .map(f => f && f[1])
    }

    /* C:\Users\jakob\sandbox\svelte\dev\svelte-filerouter\runtime\Prefetcher.svelte generated by Svelte v3.22.2 */
    const file = "C:\\Users\\jakob\\sandbox\\svelte\\dev\\svelte-filerouter\\runtime\\Prefetcher.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (58:2) {#each $actives as prefetch (prefetch.path)}
    function create_each_block(key_1, ctx) {
    	let iframe;
    	let iframe_src_value;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			iframe = element("iframe");
    			this.h();
    		},
    		l: function claim(nodes) {
    			iframe = claim_element(nodes, "IFRAME", {
    				src: true,
    				frameborder: true,
    				title: true
    			});

    			children(iframe).forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			if (iframe.src !== (iframe_src_value = /*prefetch*/ ctx[4].url)) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "frameborder", "0");
    			attr_dev(iframe, "title", "routify prefetcher");
    			add_location(iframe, file, 58, 4, 1594);
    			this.first = iframe;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, iframe, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$actives*/ 1 && iframe.src !== (iframe_src_value = /*prefetch*/ ctx[4].url)) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(iframe);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(58:2) {#each $actives as prefetch (prefetch.path)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_value = /*$actives*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*prefetch*/ ctx[4].path;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			this.h();
    		},
    		l: function claim(nodes) {
    			div = claim_element(nodes, "DIV", { id: true, style: true });
    			var div_nodes = children(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(div_nodes);
    			}

    			div_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(div, "id", "__routify_iframes");
    			set_style(div, "display", "none");
    			add_location(div, file, 56, 0, 1491);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$actives*/ 1) {
    				const each_value = /*$actives*/ ctx[0];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, destroy_block, create_each_block, null, get_each_context);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const iframeNum = 2;
    let queue = writable([]);
    let actives = derived(queue, q => q.filter(q => q.isActive));
    let queued = derived(queue, q => q.filter(q => q.isQueued));

    function prefetch(path) {
    	queue.update(q => {
    		q.push({
    			path,
    			isQueued: true,
    			isActive: false,
    			url: "/app.html?__routify_prefetch=true&__routify_path=" + path
    		});

    		return q;
    	});

    	updateQueue();
    }

    function updateQueue({ prevPath } = {}) {
    	queue.update(q => {
    		const prevFetch = q.find(q => q.path === prevPath);
    		if (prevFetch) prevFetch.isActive = false;

    		while (fetchNext(q)) {
    			
    		}

    		return q;
    	});
    }

    function fetchNext(q) {
    	const freeSpots = iframeNum > q.filter(q => q.isActive).length;
    	const nextFetch = q.find(q => q.isQueued);

    	if (freeSpots && nextFetch) {
    		nextFetch.isQueued = false;
    		nextFetch.isActive = true;
    		return true;
    	}

    	return false;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $actives;
    	validate_store(actives, "actives");
    	component_subscribe($$self, actives, $$value => $$invalidate(0, $actives = $$value));

    	var eventMethod = window.addEventListener
    	? "addEventListener"
    	: "attachEvent";

    	var eventer = window[eventMethod];
    	var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

    	// Listen to message from child window
    	eventer(
    		messageEvent,
    		function ({ data }) {
    			const { path } = data;
    			updateQueue({ prevPath: path });
    		},
    		false
    	);

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Prefetcher> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Prefetcher", $$slots, []);

    	$$self.$capture_state = () => ({
    		writable,
    		derived,
    		iframeNum,
    		queue,
    		actives,
    		queued,
    		prefetch,
    		updateQueue,
    		fetchNext,
    		eventMethod,
    		eventer,
    		messageEvent,
    		$actives
    	});

    	$$self.$inject_state = $$props => {
    		if ("eventMethod" in $$props) eventMethod = $$props.eventMethod;
    		if ("eventer" in $$props) eventer = $$props.eventer;
    		if ("messageEvent" in $$props) messageEvent = $$props.messageEvent;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$actives];
    }

    class Prefetcher extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Prefetcher",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /// <reference path="../typedef.js" />

    /** @ts-check */
    /**
     * @typedef {Object} RoutifyContext
     * @prop {ClientNode} component
     * @prop {ClientNode} layout
     * @prop {any} componentFile 
     * 
     *  @returns {import('svelte/store').Readable<RoutifyContext>} */
    function getRoutifyContext() {
      return getContext('routify') || rootContext
    }


    /**
     * @typedef {import('svelte/store').Readable<ClientNodeApi>} ClientNodeHelperStore
     * @type { ClientNodeHelperStore } 
     */
    const page = {
      subscribe(run) {
        return derived(route, route => route.api).subscribe(run)
      }
    };

    /** @type {ClientNodeHelperStore} */
    const layout = {
      subscribe(run) {
        const ctx = getRoutifyContext();
        return derived(ctx, ctx => ctx.layout.api).subscribe(run)
      }
    };

    /**
     * @typedef {function():void} ReadyHelper
     * @typedef {import('svelte/store').Readable<ReadyHelper>} ReadyHelperStore
     * @type {ReadyHelperStore}
    */
    const ready = {
      subscribe(run) {
        window['routify'].stopAutoReady = true;
        async function ready() {
          await tick();
          metatags.update();
          window['routify'].appLoaded = true;
          dispatchEvent(new CustomEvent('app-loaded'));
          parent.postMessage({
            msg: 'app-loaded',
            prefetched: window.routify.prefetched,
            path: get_store_value(route).path
          }, "*");
        }
        run(ready);
        return () => { }
      }
    };

    /**
     * @callback AfterPageLoadHelper
     * @param {function} callback
     * 
     * @typedef {import('svelte/store').Readable<AfterPageLoadHelper> & {_hooks:Array<function>}} AfterPageLoadHelperStore
     * @type {AfterPageLoadHelperStore}
     */
    const afterPageLoad = {
      _hooks: [],
      subscribe: hookHandler
    };

    /** 
     * @callback BeforeUrlChangeHelper
     * @param {function} callback
     *
     * @typedef {import('svelte/store').Readable<BeforeUrlChangeHelper> & {_hooks:Array<function>}} BeforeUrlChangeHelperStore
     * @type {BeforeUrlChangeHelperStore}
     **/
    const beforeUrlChange = {
      _hooks: [],
      subscribe: hookHandler
    };

    function hookHandler(listener) {
      const hooks = this._hooks;
      const index = hooks.length;
      listener(callback => { hooks[index] = callback; });
      return () => delete hooks[index]
    }

    /**
     * @callback UrlHelper
     * @param {String=} path
     * @param {UrlParams=} params
     * @param {UrlOptions=} options
     * @return {String}
     *
     * @typedef {import('svelte/store').Readable<UrlHelper>} UrlHelperStore
     * @type {UrlHelperStore} 
     * */
    const url = {
      subscribe(listener) {
        const ctx = getRoutifyContext();
        return derived(
          [ctx, route, routes, location$1],
          args => makeUrlHelper(...args)
        ).subscribe(
          listener
        )
      }
    };

    /** 
     * @param {{component: ClientNode}} $ctx 
     * @param {RouteNode} $oldRoute 
     * @param {RouteNode[]} $routes 
     * @param {{base: string, path: string}} $location
     * @returns {UrlHelper}
     */
    function makeUrlHelper($ctx, $oldRoute, $routes, $location) {
      return function url(path, params, options) {
        const { component } = $ctx;
        path = path || './';

        const strict = options && options.strict !== false;
        if (!strict) path = path.replace(/index$/, '');

        if (path.match(/^\.\.?\//)) {
          //RELATIVE PATH
          let [, breadcrumbs, relativePath] = path.match(/^([\.\/]+)(.*)/);
          let dir = component.path.replace(/\/$/, '');
          const traverse = breadcrumbs.match(/\.\.\//g) || [];
          traverse.forEach(() => dir = dir.replace(/\/[^\/]+\/?$/, ''));
          path = `${dir}/${relativePath}`.replace(/\/$/, '');

        } else if (path.match(/^\//)) ; else {
          // NAMED PATH
          const matchingRoute = $routes.find(route => route.meta.name === path);
          if (matchingRoute) path = matchingRoute.shortPath;
        }

        /** @type {Object<string, *>} Parameters */
        const allParams = Object.assign({}, $oldRoute.params, component.params, params);
        let pathWithParams = path;
        for (const [key, value] of Object.entries(allParams)) {
          pathWithParams = pathWithParams.replace(`:${key}`, value);
        }

        const fullPath = $location.base + pathWithParams + _getQueryString(path, params);
        return fullPath.replace(/\?$/, '')
      }
    }

    /**
     * 
     * @param {string} path 
     * @param {object} params 
     */
    function _getQueryString(path, params) {
      if (!defaultConfig.queryHandler) return ""
      const pathParamKeys = pathToParams(path);
      const queryParams = {};
      if (params) Object.entries(params).forEach(([key, value]) => {
        if (!pathParamKeys.includes(key))
          queryParams[key] = value;
      });
      return defaultConfig.queryHandler.stringify(queryParams)
    }

    /**
    * @callback GotoHelper
    * @param {String=} path
    * @param {UrlParams=} params
    * @param {GotoOptions=} options
    *
    * @typedef {import('svelte/store').Readable<GotoHelper>}  GotoHelperStore
    * @type {GotoHelperStore} 
    * */
    const goto = {
      subscribe(listener) {
        return derived(url,
          url => function goto(path, params, _static, shallow) {
            const href = url(path, params);
            if (!_static) history.pushState({}, null, href);
            else getContext('routifyupdatepage')(href, shallow);
          }
        ).subscribe(
          listener
        )
      },
    };

    /**
     * @callback IsActiveHelper
     * @param {String=} path
     * @param {UrlParams=} params
     * @param {UrlOptions=} options
     * @returns {Boolean}
     * 
     * @typedef {import('svelte/store').Readable<IsActiveHelper>} IsActiveHelperStore
     * @type {IsActiveHelperStore} 
     * */
    const isActive = {
      subscribe(run) {
        return derived(
          [url, route],
          ([url, route]) => function isActive(path = "", params = {}, { strict } = { strict: true }) {
            path = url(path, null, { strict });
            const currentPath = url(route.path, null, { strict });
            const re = new RegExp('^' + path + '($|/)');
            return !!currentPath.match(re)
          }
        ).subscribe(run)
      },
    };

    /**
     * @param {string|ClientNodeApi} path 
     * @param {*} options 
     */
    function prefetch$1(path, options) {
      prefetch(path);
      // console.log('prefetching', path)
      // prefetchPath.set('/app.html?__routify_prefetch=true&__routify_path=' + path)
    }



    const _metatags = {
      props: {},
      templates: {},
      services: {
        plain: { propField: 'name', valueField: 'content' },
        twitter: { propField: 'name', valueField: 'content' },
        og: { propField: 'property', valueField: 'content' },
      },
      plugins: [
        {
          name: 'applyTemplate',
          condition: () => true,
          action: (prop, value) => {
            const template = _metatags.getLongest(_metatags.templates, prop) || (x => x);
            return [prop, template(value)]
          }
        },
        {
          name: 'createMeta',
          condition: () => true,
          action(prop, value) {
            _metatags.writeMeta(prop, value);
          }
        },
        {
          name: 'createOG',
          condition: prop => !prop.match(':'),
          action(prop, value) {
            _metatags.writeMeta(`og:${prop}`, value);
          }
        },
        {
          name: 'createTitle',
          condition: prop => prop === 'title',
          action(prop, value) {
            document.title = value;
          }
        }
      ],
      getLongest(repo, name) {
        const providers = repo[name];
        if (providers) {
          const currentPath = get_store_value(route).path;
          const allPaths = Object.keys(repo[name]);
          const matchingPaths = allPaths.filter(path => currentPath.includes(path));

          const longestKey = matchingPaths.sort((a, b) => b.length - a.length)[0];

          return providers[longestKey]
        }
      },
      writeMeta(prop, value) {
        const head = document.getElementsByTagName('head')[0];
        const match = prop.match(/(.+)\:/);
        const serviceName = match && match[1] || 'plain';
        const { propField, valueField } = metatags.services[serviceName] || metatags.services.plain;
        const oldElement = document.querySelector(`meta[${propField}='${prop}']`);
        if (oldElement) oldElement.remove();

        const newElement = document.createElement('meta');
        newElement.setAttribute(propField, prop);
        newElement.setAttribute(valueField, value);
        newElement.setAttribute('data-origin', 'routify');
        head.appendChild(newElement);
      },
      set(prop, value) {
        _metatags.plugins.forEach(plugin => {
          if (plugin.condition(prop, value))
            [prop, value] = plugin.action(prop, value) || [prop, value];
        });
      },
      clear() {
        const oldElement = document.querySelector(`meta`);
        if (oldElement) oldElement.remove();
      },
      template(name, fn) {
        const origin = _metatags.getOrigin();
        _metatags.templates[name] = _metatags.templates[name] || {};
        _metatags.templates[name][origin] = fn;
      },
      update() {
        Object.keys(_metatags.props).forEach((prop) => {
          let value = (_metatags.getLongest(_metatags.props, prop));
          _metatags.plugins.forEach(plugin => {
            if (plugin.condition(prop, value)) {
              [prop, value] = plugin.action(prop, value) || [prop, value];

            }
          });
        });
      },
      batchedUpdate() {
        if (!_metatags._pendingUpdate) {
          _metatags._pendingUpdate = true;
          setTimeout(() => {
            _metatags._pendingUpdate = false;
            this.update();
          });
        }
      },
      _updateQueued: false,
      getOrigin() {
        const routifyCtx = getRoutifyContext();
        return routifyCtx && get_store_value(routifyCtx).path || '/'
      },
      _pendingUpdate: false
    };


    /**
     * metatags
     * @prop {Object.<string, string>}
     */
    const metatags = new Proxy(_metatags, {
      set(target, name, value, receiver) {
        const { props, getOrigin } = target;

        if (Reflect.has(target, name))
          Reflect.set(target, name, value, receiver);
        else {
          props[name] = props[name] || {};
          props[name][getOrigin()] = value;
        }

        if (window['routify'].appLoaded)
          target.batchedUpdate();
        return true
      }
    });

    /* C:\Users\jakob\sandbox\svelte\dev\svelte-filerouter\runtime\Route.svelte generated by Svelte v3.22.2 */
    const file$1 = "C:\\Users\\jakob\\sandbox\\svelte\\dev\\svelte-filerouter\\runtime\\Route.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[21] = list[i].component;
    	child_ctx[22] = list[i].componentFile;
    	return child_ctx;
    }

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[21] = list[i].component;
    	child_ctx[22] = list[i].componentFile;
    	return child_ctx;
    }

    // (132:0) {#if $context}
    function create_if_block_1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2, create_if_block_3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$context*/ ctx[6].component.isLayout === false) return 0;
    		if (/*remainingLayouts*/ ctx[5].length) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			if (if_block) if_block.l(nodes);
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(132:0) {#if $context}",
    		ctx
    	});

    	return block;
    }

    // (144:36) 
    function create_if_block_3(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value_1 = [/*$context*/ ctx[6]];
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*component*/ ctx[21].path;
    	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

    	for (let i = 0; i < 1; i += 1) {
    		let child_ctx = get_each_context_1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].l(nodes);
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$context, scoped, scopedSync, layout, remainingLayouts, decorator, Decorator, scopeToChild*/ 402653303) {
    				const each_value_1 = [/*$context*/ ctx[6]];
    				validate_each_argument(each_value_1);
    				group_outros();
    				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block_1, each_1_anchor, get_each_context_1);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < 1; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 1; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(144:36) ",
    		ctx
    	});

    	return block;
    }

    // (133:2) {#if $context.component.isLayout === false}
    function create_if_block_2(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = [/*$context*/ ctx[6]];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*component*/ ctx[21].path;
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < 1; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].l(nodes);
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$context, scoped, scopedSync, layout*/ 85) {
    				const each_value = [/*$context*/ ctx[6]];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$1, each_1_anchor, get_each_context$1);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < 1; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 1; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(133:2) {#if $context.component.isLayout === false}",
    		ctx
    	});

    	return block;
    }

    // (146:6) <svelte:component          this={componentFile}          let:scoped={scopeToChild}          let:decorator          {scoped}          {scopedSync}          {...layout.param || {}}>
    function create_default_slot(ctx) {
    	let t;
    	let current;

    	const route_1 = new Route({
    			props: {
    				layouts: [.../*remainingLayouts*/ ctx[5]],
    				Decorator: typeof /*decorator*/ ctx[28] !== "undefined"
    				? /*decorator*/ ctx[28]
    				: /*Decorator*/ ctx[1],
    				childOfDecorator: /*layout*/ ctx[4].isDecorator,
    				scoped: {
    					.../*scoped*/ ctx[0],
    					.../*scopeToChild*/ ctx[27]
    				}
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route_1.$$.fragment);
    			t = space();
    		},
    		l: function claim(nodes) {
    			claim_component(route_1.$$.fragment, nodes);
    			t = claim_space(nodes);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route_1, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route_1_changes = {};
    			if (dirty & /*remainingLayouts*/ 32) route_1_changes.layouts = [.../*remainingLayouts*/ ctx[5]];

    			if (dirty & /*decorator, Decorator*/ 268435458) route_1_changes.Decorator = typeof /*decorator*/ ctx[28] !== "undefined"
    			? /*decorator*/ ctx[28]
    			: /*Decorator*/ ctx[1];

    			if (dirty & /*layout*/ 16) route_1_changes.childOfDecorator = /*layout*/ ctx[4].isDecorator;

    			if (dirty & /*scoped, scopeToChild*/ 134217729) route_1_changes.scoped = {
    				.../*scoped*/ ctx[0],
    				.../*scopeToChild*/ ctx[27]
    			};

    			route_1.$set(route_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route_1, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(146:6) <svelte:component          this={componentFile}          let:scoped={scopeToChild}          let:decorator          {scoped}          {scopedSync}          {...layout.param || {}}>",
    		ctx
    	});

    	return block;
    }

    // (145:4) {#each [$context] as { component, componentFile }
    function create_each_block_1(key_1, ctx) {
    	let first;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ scoped: /*scoped*/ ctx[0] },
    		{ scopedSync: /*scopedSync*/ ctx[2] },
    		/*layout*/ ctx[4].param || {}
    	];

    	var switch_value = /*componentFile*/ ctx[22];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: {
    				default: [
    					create_default_slot,
    					({ scoped: scopeToChild, decorator }) => ({ 27: scopeToChild, 28: decorator }),
    					({ scoped: scopeToChild, decorator }) => (scopeToChild ? 134217728 : 0) | (decorator ? 268435456 : 0)
    				]
    			},
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    			this.h();
    		},
    		l: function claim(nodes) {
    			first = empty();
    			if (switch_instance) claim_component(switch_instance.$$.fragment, nodes);
    			switch_instance_anchor = empty();
    			this.h();
    		},
    		h: function hydrate() {
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*scoped, scopedSync, layout*/ 21)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*scoped*/ 1 && { scoped: /*scoped*/ ctx[0] },
    					dirty & /*scopedSync*/ 4 && { scopedSync: /*scopedSync*/ ctx[2] },
    					dirty & /*layout*/ 16 && get_spread_object(/*layout*/ ctx[4].param || {})
    				])
    			: {};

    			if (dirty & /*$$scope, remainingLayouts, decorator, Decorator, layout, scoped, scopeToChild*/ 939524147) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*componentFile*/ ctx[22])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(145:4) {#each [$context] as { component, componentFile }",
    		ctx
    	});

    	return block;
    }

    // (134:4) {#each [$context] as { component, componentFile }
    function create_each_block$1(key_1, ctx) {
    	let first;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ scoped: /*scoped*/ ctx[0] },
    		{ scopedSync: /*scopedSync*/ ctx[2] },
    		/*layout*/ ctx[4].param || {}
    	];

    	var switch_value = /*componentFile*/ ctx[22];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    			this.h();
    		},
    		l: function claim(nodes) {
    			first = empty();
    			if (switch_instance) claim_component(switch_instance.$$.fragment, nodes);
    			switch_instance_anchor = empty();
    			this.h();
    		},
    		h: function hydrate() {
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*scoped, scopedSync, layout*/ 21)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*scoped*/ 1 && { scoped: /*scoped*/ ctx[0] },
    					dirty & /*scopedSync*/ 4 && { scopedSync: /*scopedSync*/ ctx[2] },
    					dirty & /*layout*/ 16 && get_spread_object(/*layout*/ ctx[4].param || {})
    				])
    			: {};

    			if (switch_value !== (switch_value = /*componentFile*/ ctx[22])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(134:4) {#each [$context] as { component, componentFile }",
    		ctx
    	});

    	return block;
    }

    // (164:0) {#if !parentElement}
    function create_if_block(ctx) {
    	let span;
    	let setParent_action;
    	let dispose;

    	const block = {
    		c: function create() {
    			span = element("span");
    			this.h();
    		},
    		l: function claim(nodes) {
    			span = claim_element(nodes, "SPAN", {});
    			children(span).forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			add_location(span, file$1, 164, 2, 4904);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, span, anchor);
    			if (remount) dispose();
    			dispose = action_destroyer(setParent_action = /*setParent*/ ctx[8].call(null, span));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(164:0) {#if !parentElement}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*$context*/ ctx[6] && create_if_block_1(ctx);
    	let if_block1 = !/*parentElement*/ ctx[3] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			if (if_block0) if_block0.l(nodes);
    			t = claim_space(nodes);
    			if (if_block1) if_block1.l(nodes);
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$context*/ ctx[6]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*$context*/ 64) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!/*parentElement*/ ctx[3]) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $context;
    	let $route;
    	validate_store(route, "route");
    	component_subscribe($$self, route, $$value => $$invalidate(15, $route = $$value));
    	let { layouts = [] } = $$props;
    	let { scoped = {} } = $$props;
    	let { Decorator = null } = $$props;
    	let { childOfDecorator = false } = $$props;
    	let { isRoot = false } = $$props;
    	let scopedSync = {};
    	let layoutIsUpdated = false;
    	let isDecorator = false;

    	/** @type {HTMLElement} */
    	let parentElement;

    	/** @type {LayoutOrDecorator} */
    	let layout = null;

    	/** @type {LayoutOrDecorator} */
    	let lastLayout = null;

    	/** @type {LayoutOrDecorator[]} */
    	let remainingLayouts = [];

    	const context = writable(null);
    	validate_store(context, "context");
    	component_subscribe($$self, context, value => $$invalidate(6, $context = value));

    	/** @type {import("svelte/store").Writable<Context>} */
    	const parentContextStore = getContext("routify");

    	isDecorator = Decorator && !childOfDecorator;
    	setContext("routify", context);

    	/** @param {HTMLElement} el */
    	function setParent(el) {
    		$$invalidate(3, parentElement = el.parentElement);
    	}

    	/** @param {SvelteComponent} componentFile */
    	function onComponentLoaded(componentFile) {
    		/** @type {Context} */
    		const parentContext = get_store_value(parentContextStore);

    		$$invalidate(2, scopedSync = { ...scoped });
    		$$invalidate(14, lastLayout = layout);
    		if (remainingLayouts.length === 0) onLastComponentLoaded();

    		const ctx = {
    			layout: isDecorator ? parentContext.layout : layout,
    			component: layout,
    			componentFile,
    			child: isDecorator
    			? parentContext.child
    			: get_store_value(context) && get_store_value(context).child
    		};

    		context.set(ctx);
    		if (isRoot) rootContext.set(ctx);

    		if (parentContext && !isDecorator) parentContextStore.update(store => {
    			store.child = layout || store.child;
    			return store;
    		});
    	}

    	/**  @param {LayoutOrDecorator} layout */
    	function setComponent(layout) {
    		let PendingComponent = layout.component();
    		if (PendingComponent instanceof Promise) PendingComponent.then(onComponentLoaded); else onComponentLoaded(PendingComponent);
    	}

    	async function onLastComponentLoaded() {
    		afterPageLoad._hooks.forEach(hook => hook(layout.api));
    		await tick();
    		handleScroll(parentElement);
    		metatags.update();
    		if (!window["routify"].appLoaded) onAppLoaded();
    	}

    	async function onAppLoaded() {
    		const pagePath = $context.component.path;
    		const routePath = $route.path;
    		const isOnCurrentRoute = pagePath === routePath; //maybe we're getting redirected

    		// Let everyone know the last child has rendered
    		if (!window["routify"].stopAutoReady && isOnCurrentRoute) {
    			dispatchEvent(new CustomEvent("app-loaded"));

    			parent.postMessage(
    				{
    					msg: "app-loaded",
    					prefetched: window.routify.prefetched,
    					path: pagePath
    				},
    				"*"
    			);

    			window["routify"].appLoaded = true;
    		}
    	}

    	const writable_props = ["layouts", "scoped", "Decorator", "childOfDecorator", "isRoot"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Route> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Route", $$slots, []);

    	$$self.$set = $$props => {
    		if ("layouts" in $$props) $$invalidate(9, layouts = $$props.layouts);
    		if ("scoped" in $$props) $$invalidate(0, scoped = $$props.scoped);
    		if ("Decorator" in $$props) $$invalidate(1, Decorator = $$props.Decorator);
    		if ("childOfDecorator" in $$props) $$invalidate(10, childOfDecorator = $$props.childOfDecorator);
    		if ("isRoot" in $$props) $$invalidate(11, isRoot = $$props.isRoot);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onDestroy,
    		onMount,
    		tick,
    		writable,
    		get: get_store_value,
    		metatags,
    		afterPageLoad,
    		route,
    		routes,
    		rootContext,
    		handleScroll,
    		layouts,
    		scoped,
    		Decorator,
    		childOfDecorator,
    		isRoot,
    		scopedSync,
    		layoutIsUpdated,
    		isDecorator,
    		parentElement,
    		layout,
    		lastLayout,
    		remainingLayouts,
    		context,
    		parentContextStore,
    		setParent,
    		onComponentLoaded,
    		setComponent,
    		onLastComponentLoaded,
    		onAppLoaded,
    		$context,
    		$route
    	});

    	$$self.$inject_state = $$props => {
    		if ("layouts" in $$props) $$invalidate(9, layouts = $$props.layouts);
    		if ("scoped" in $$props) $$invalidate(0, scoped = $$props.scoped);
    		if ("Decorator" in $$props) $$invalidate(1, Decorator = $$props.Decorator);
    		if ("childOfDecorator" in $$props) $$invalidate(10, childOfDecorator = $$props.childOfDecorator);
    		if ("isRoot" in $$props) $$invalidate(11, isRoot = $$props.isRoot);
    		if ("scopedSync" in $$props) $$invalidate(2, scopedSync = $$props.scopedSync);
    		if ("layoutIsUpdated" in $$props) layoutIsUpdated = $$props.layoutIsUpdated;
    		if ("isDecorator" in $$props) $$invalidate(13, isDecorator = $$props.isDecorator);
    		if ("parentElement" in $$props) $$invalidate(3, parentElement = $$props.parentElement);
    		if ("layout" in $$props) $$invalidate(4, layout = $$props.layout);
    		if ("lastLayout" in $$props) $$invalidate(14, lastLayout = $$props.lastLayout);
    		if ("remainingLayouts" in $$props) $$invalidate(5, remainingLayouts = $$props.remainingLayouts);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*isDecorator, Decorator, layouts*/ 8706) {
    			 if (isDecorator) {
    				const decoratorLayout = {
    					component: () => Decorator,
    					path: `${layouts[0].path}__decorator`,
    					isDecorator: true
    				};

    				$$invalidate(9, layouts = [decoratorLayout, ...layouts]);
    			}
    		}

    		if ($$self.$$.dirty & /*layouts*/ 512) {
    			 $$invalidate(4, [layout, ...remainingLayouts] = layouts, layout, ((($$invalidate(5, remainingLayouts), $$invalidate(9, layouts)), $$invalidate(13, isDecorator)), $$invalidate(1, Decorator)));
    		}

    		if ($$self.$$.dirty & /*lastLayout, layout*/ 16400) {
    			 layoutIsUpdated = !lastLayout || lastLayout.path !== layout.path;
    		}

    		if ($$self.$$.dirty & /*layout*/ 16) {
    			 setComponent(layout);
    		}
    	};

    	return [
    		scoped,
    		Decorator,
    		scopedSync,
    		parentElement,
    		layout,
    		remainingLayouts,
    		$context,
    		context,
    		setParent,
    		layouts,
    		childOfDecorator,
    		isRoot
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			layouts: 9,
    			scoped: 0,
    			Decorator: 1,
    			childOfDecorator: 10,
    			isRoot: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get layouts() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set layouts(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scoped() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scoped(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Decorator() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Decorator(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get childOfDecorator() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set childOfDecorator(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isRoot() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isRoot(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const { _hooks } = beforeUrlChange;

    function init$1(routes, callback) {
      /** @type { ClientNode | false } */
      let lastRoute = false;

      function updatePage(proxyToUrl, shallow) {
        const url = proxyToUrl || currentLocation();
        const route$1 = urlToRoute(url);
        const currentRoute = shallow && urlToRoute(currentLocation());
        const contextRoute = currentRoute || route$1;
        const layouts = [...contextRoute.layouts, route$1];
        if (lastRoute) delete lastRoute.last; //todo is a page component the right place for the previous route?
        route$1.last = lastRoute;
        lastRoute = route$1;

        //set the route in the store
        if (!proxyToUrl)
          urlRoute.set(route$1);
        route.set(route$1);

        //run callback in Router.svelte
        callback(layouts);
      }

      const destroy = createEventListeners(updatePage);

      return { updatePage, destroy }
    }

    /**
     * svelte:window events doesn't work on refresh
     * @param {Function} updatePage
     */
    function createEventListeners(updatePage) {
    ['pushState', 'replaceState'].forEach(eventName => {
        const fn = history[eventName];
        history[eventName] = async function (state = {}, title, url) {
          const { id, path, params } = get_store_value(route);
          state = { id, path, params, ...state };
          const event = new Event(eventName.toLowerCase());
          Object.assign(event, { state, title, url });

          if (await runHooksBeforeUrlChange(event)) {
            fn.apply(this, [state, title, url]);
            return dispatchEvent(event)
          }
        };
      });

      let _ignoreNextPop = false;

      const listeners = {
        click: handleClick,
        pushstate: () => updatePage(),
        replacestate: () => updatePage(),
        popstate: async event => {
          if (_ignoreNextPop)
            _ignoreNextPop = false;
          else {
            if (await runHooksBeforeUrlChange(event)) {
              updatePage();
            } else {
              _ignoreNextPop = true;
              event.preventDefault();
              history.go(1);
            }
          }
        },
      };

      Object.entries(listeners).forEach(args => addEventListener(...args));

      const unregister = () => {
        Object.entries(listeners).forEach(args => removeEventListener(...args));
      };

      return unregister
    }

    function handleClick(event) {
      const el = event.target.closest('a');
      const href = el && el.getAttribute('href');

      if (
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.shiftKey ||
        event.button ||
        event.defaultPrevented
      )
        return
      if (!href || el.target || el.host !== location.host) return

      event.preventDefault();
      history.pushState({}, '', href);
    }

    async function runHooksBeforeUrlChange(event) {
      const route$1 = get_store_value(route);
      for (const hook of _hooks.filter(Boolean)) {
        // return false if the hook returns false
        if (await !hook(event, route$1)) return false //todo remove route from hook. Its API Can be accessed as $page
      }
      return true
    }

    /* C:\Users\jakob\sandbox\svelte\dev\svelte-filerouter\runtime\Router.svelte generated by Svelte v3.22.2 */

    const { Object: Object_1 } = globals;

    // (65:0) {#if layouts && $route !== null}
    function create_if_block$1(ctx) {
    	let current;

    	const route_1 = new Route({
    			props: {
    				layouts: /*layouts*/ ctx[0],
    				isRoot: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route_1.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(route_1.$$.fragment, nodes);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route_1_changes = {};
    			if (dirty & /*layouts*/ 1) route_1_changes.layouts = /*layouts*/ ctx[0];
    			route_1.$set(route_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(65:0) {#if layouts && $route !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let t;
    	let current;
    	let if_block = /*layouts*/ ctx[0] && /*$route*/ ctx[1] !== null && create_if_block$1(ctx);
    	const prefetcher = new Prefetcher({ $$inline: true });

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			create_component(prefetcher.$$.fragment);
    		},
    		l: function claim(nodes) {
    			if (if_block) if_block.l(nodes);
    			t = claim_space(nodes);
    			claim_component(prefetcher.$$.fragment, nodes);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(prefetcher, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*layouts*/ ctx[0] && /*$route*/ ctx[1] !== null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*layouts, $route*/ 3) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(prefetcher.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(prefetcher.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(prefetcher, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $route;
    	validate_store(route, "route");
    	component_subscribe($$self, route, $$value => $$invalidate(1, $route = $$value));
    	let { routes: routes$1 } = $$props;
    	let { config = {} } = $$props;
    	let layouts;
    	let navigator;

    	Object.entries(config).forEach(([key, value]) => {
    		defaultConfig[key] = value;
    	});

    	suppressWarnings();

    	if (!window.routify) {
    		window.routify = {};
    	}

    	const updatePage = (...args) => navigator && navigator.updatePage(...args);
    	setContext("routifyupdatepage", updatePage);
    	const callback = res => $$invalidate(0, layouts = res);

    	const cleanup = () => {
    		if (!navigator) return;
    		navigator.destroy();
    		navigator = null;
    	};

    	let initTimeout = null;

    	// init is async to prevent a horrible bug that completely disable reactivity
    	// in the host component -- something like the component's update function is
    	// called before its fragment is created, and since the component is then seen
    	// as already dirty, it is never scheduled for update again, and remains dirty
    	// forever... I failed to isolate the precise conditions for the bug, but the
    	// faulty update is triggered by a change in the route store, and so offseting
    	// store initialization by one tick gives the host component some time to
    	// create its fragment. The root cause it probably a bug in Svelte with deeply
    	// intertwinned store and reactivity.
    	const doInit = () => {
    		clearTimeout(initTimeout);

    		initTimeout = setTimeout(() => {
    			cleanup();
    			navigator = init$1(routes$1, callback);
    			routes.set(routes$1);
    			navigator.updatePage();
    		});
    	};

    	onDestroy(cleanup);
    	const writable_props = ["routes", "config"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Router", $$slots, []);

    	$$self.$set = $$props => {
    		if ("routes" in $$props) $$invalidate(2, routes$1 = $$props.routes);
    		if ("config" in $$props) $$invalidate(3, config = $$props.config);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		onDestroy,
    		Route,
    		Prefetcher,
    		init: init$1,
    		route,
    		routesStore: routes,
    		prefetchPath,
    		suppressWarnings,
    		defaultConfig,
    		routes: routes$1,
    		config,
    		layouts,
    		navigator,
    		updatePage,
    		callback,
    		cleanup,
    		initTimeout,
    		doInit,
    		$route
    	});

    	$$self.$inject_state = $$props => {
    		if ("routes" in $$props) $$invalidate(2, routes$1 = $$props.routes);
    		if ("config" in $$props) $$invalidate(3, config = $$props.config);
    		if ("layouts" in $$props) $$invalidate(0, layouts = $$props.layouts);
    		if ("navigator" in $$props) navigator = $$props.navigator;
    		if ("initTimeout" in $$props) initTimeout = $$props.initTimeout;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*routes*/ 4) {
    			 if (routes$1) doInit();
    		}
    	};

    	return [layouts, $route, routes$1, config];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { routes: 2, config: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*routes*/ ctx[2] === undefined && !("routes" in props)) {
    			console.warn("<Router> was created without expected prop 'routes'");
    		}
    	}

    	get routes() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get config() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set config(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /** 
     * Node payload
     * @typedef {Object} NodePayload
     * @property {RouteNode=} file current node
     * @property {RouteNode=} parent parent of the current node
     * @property {StateObject=} state state shared by every node in the walker
     * @property {Object=} scope scope inherited by descendants in the scope
     *
     * State Object
     * @typedef {Object} StateObject
     * @prop {TreePayload=} treePayload payload from the tree
     * 
     * Node walker proxy
     * @callback NodeWalkerProxy
     * @param {NodePayload} NodePayload
     */


    /**
     * Node middleware
     * @description Walks through the nodes of a tree
     * @example middleware = createNodeMiddleware(payload => {payload.file.name = 'hello'})(treePayload))
     * @param {NodeWalkerProxy} fn 
     */
    function createNodeMiddleware(fn) {

        /**    
         * NodeMiddleware payload receiver
         * @param {TreePayload} payload
         */
        const inner = async function execute(payload) {
            return await nodeMiddleware(payload.tree, fn, { state: { treePayload: payload } })
        };

        /**    
         * NodeMiddleware sync payload receiver
         * @param {TreePayload} payload
         */
        inner.sync = function executeSync(payload) {
            return nodeMiddlewareSync(payload.tree, fn, { state: { treePayload: payload } })
        };

        return inner
    }

    /**
     * Node walker
     * @param {Object} file mutable file
     * @param {NodeWalkerProxy} fn function to be called for each file
     * @param {NodePayload=} payload 
     */
    async function nodeMiddleware(file, fn, payload) {
        const { state, scope, parent } = payload || {};
        payload = {
            file,
            parent,
            state: state || {},            //state is shared by all files in the walk
            scope: clone(scope || {}),     //scope is inherited by descendants
        };

        await fn(payload);

        if (file.children) {
            payload.parent = file;
            await Promise.all(file.children.map(_file => nodeMiddleware(_file, fn, payload)));
        }
        return payload
    }

    /**
     * Node walker (sync version)
     * @param {Object} file mutable file
     * @param {NodeWalkerProxy} fn function to be called for each file
     * @param {NodePayload=} payload 
     */
    function nodeMiddlewareSync(file, fn, payload) {
        const { state, scope, parent } = payload || {};
        payload = {
            file,
            parent,
            state: state || {},            //state is shared by all files in the walk
            scope: clone(scope || {}),     //scope is inherited by descendants
        };

        fn(payload);

        if (file.children) {
            payload.parent = file;
            file.children.map(_file => nodeMiddlewareSync(_file, fn, payload));
        }
        return payload
    }


    /**
     * Clone with JSON
     * @param {T} obj 
     * @returns {T} JSON cloned object
     * @template T
     */
    function clone(obj) { return JSON.parse(JSON.stringify(obj)) }



    var middleware = { createNodeMiddleware, nodeMiddleware, nodeMiddlewareSync };
    var middleware_1 = middleware.createNodeMiddleware;

    const setRegex = middleware_1(({ file }) => {
        if (file.isPage || file.isFallback)
            file.regex = pathToRegex(file.path, file.isFallback);
    });
    const setParamKeys = middleware_1(({ file }) => {
        file.paramKeys = pathToParams(file.path);
    });

    const setShortPath = middleware_1(({ file }) => {
        if (file.isFallback || file.isIndex)
            file.shortPath = file.path.replace(/\/[^/]+$/, '');
        else file.shortPath = file.path;
    });
    const setRank = middleware_1(({ file }) => {
        file.ranking = pathToRank(file);
    });


    // todo delete?
    const addMetaChildren = middleware_1(({ file }) => {
        const node = file;
        const metaChildren = file.meta && file.meta.children || [];
        if (metaChildren.length) {
            node.children = node.children || [];
            node.children.push(...metaChildren.map(meta => ({ isMeta: true, ...meta, meta })));
        }
    });

    const setIsIndexable = middleware_1(payload => {
        const { file } = payload;
        const { isLayout, isFallback, meta } = file;
        file.isIndexable = !isLayout && !isFallback && meta.index !== false;
        file.isNonIndexable = !file.isIndexable;
    });


    const assignRelations = middleware_1(({ file, parent }) => {
        Object.defineProperty(file, 'parent', { get: () => parent });
        Object.defineProperty(file, 'nextSibling', { get: () => _getSibling(file, 1) });
        Object.defineProperty(file, 'prevSibling', { get: () => _getSibling(file, -1) });
        Object.defineProperty(file, 'lineage', { get: () => _getLineage(parent) });
    });

    function _getLineage(node, lineage = []){
        if(node){
            lineage.unshift(node);
            _getLineage(node.parent, lineage);
        }
        return lineage
    }

    /**
     * 
     * @param {RouteNode} file 
     * @param {Number} direction 
     */
    function _getSibling(file, direction) {
        if (!file.root) {
            const siblings = file.parent.children.filter(c => c.isIndexable);
            const index = siblings.indexOf(file);
            return siblings[index + direction]
        }
    }

    const assignIndex = middleware_1(({ file, parent }) => {
        if (file.isIndex) Object.defineProperty(parent, 'index', { get: () => file });
        if (file.isLayout)
            Object.defineProperty(parent, 'layout', { get: () => file });
    });

    const assignLayout = middleware_1(({ file, scope }) => {
        Object.defineProperty(file, 'layouts', { get: () => getLayouts(file) });
        function getLayouts(file) {
            const { parent } = file;
            const layout = parent && parent.layout;
            const isReset = layout && layout.isReset;
            const layouts = (parent && !isReset && getLayouts(parent)) || [];
            if (layout) layouts.push(layout);
            return layouts
        }
    });


    const createFlatList = treePayload => {
        middleware_1(payload => {
            if (payload.file.isPage || payload.file.isFallback)
            payload.state.treePayload.routes.push(payload.file);
        }).sync(treePayload);    
        treePayload.routes.sort((c, p) => (c.ranking >= p.ranking ? -1 : 1));
    };

    const setPrototype = middleware_1(({ file }) => {
        const Prototype = file.root
            ? Root
            : file.children
                ? file.isFile ? PageDir : Dir
                : file.isReset
                    ? Reset
                    : file.isLayout
                        ? Layout
                        : file.isFallback
                            ? Fallback
                            : Page;
        Object.setPrototypeOf(file, Prototype.prototype);

        function Layout() { }
        function Dir() { }
        function Fallback() { }
        function Page() { }
        function PageDir() { }
        function Reset() { }
        function Root() { }
    });

    var miscPlugins = /*#__PURE__*/Object.freeze({
        __proto__: null,
        setRegex: setRegex,
        setParamKeys: setParamKeys,
        setShortPath: setShortPath,
        setRank: setRank,
        addMetaChildren: addMetaChildren,
        setIsIndexable: setIsIndexable,
        assignRelations: assignRelations,
        assignIndex: assignIndex,
        assignLayout: assignLayout,
        createFlatList: createFlatList,
        setPrototype: setPrototype
    });

    const assignAPI = middleware_1(({ file }) => {
        file.api = new ClientApi(file);
    });

    class ClientApi {
        constructor(file) {
            this.__file = file;
            Object.defineProperty(this, '__file', { enumerable: false });
            this.isMeta = !!file.isMeta;
            this.path = file.path;
            this.title = _prettyName(file);
            this.meta = file.meta;
        }

        get parent() { return !this.__file.root && this.__file.parent.api }
        get children() {
            return (this.__file.children || this.__file.isLayout && this.__file.parent.children || [])
                .filter(c => !c.isNonIndexable)
                .sort((a, b) => {
                    a = (a.meta.index || a.meta.title || a.path).toString();
                    b = (b.meta.index || b.meta.title || b.path).toString();
                    return a.localeCompare((b), undefined, { numeric: true, sensitivity: 'base' })
                })
                .map(({ api }) => api)
        }
        get next() { return _navigate(this, +1) }
        get prev() { return _navigate(this, -1) }
    }

    function _navigate(node, direction) {
        if (!node.__file.root) {
            const siblings = node.parent.children;
            const index = siblings.indexOf(node);
            return node.parent.children[index + direction]
        }
    }


    function _prettyName(file) {
        if (typeof file.meta.title !== 'undefined') return file.meta.title
        else return (file.shortPath || file.path)
            .split('/')
            .pop()
            .replace(/-/g, ' ')
    }

    const plugins = {...miscPlugins, assignAPI};

    function buildClientTree(tree) {
      const order = [
        // pages
        "setParamKeys", //pages only
        "setRegex", //pages only
        "setShortPath", //pages only
        "setRank", //pages only
        "assignLayout", //pages only,
        // all
        "setPrototype",
        "addMetaChildren",
        "assignRelations", //all (except meta components?)
        "setIsIndexable", //all
        "assignIndex", //all
        "assignAPI", //all
        // routes
        "createFlatList"
      ];

      const payload = { tree, routes: [] };
      for (let name of order) {
        const syncFn = plugins[name].sync || plugins[name];
        syncFn(payload);
      }
      return payload
    }

    const draggedFile = writable(null);
    const tree = writable(null);
    const routes$1 = writable(null);
    const state = writable({
        currentNode: null,
        port: null
    });

    function writeFile(path, meta) {
        postData('/writefile', { path, meta });
    }

    function moveFile(source, target) {
        postData('/movefile', { source, target });
    }

    function postData(path, data) {
        fetch(`//localhost:${get_store_value(options).port}${path}`, {
            mode: 'cors',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }

    const defaultOptions = {
        showHelper: true,
        showTree: true,
        showFile: false,
        showIndex: false,
        port: null,
        ...JSON.parse(localStorage.getItem('__routify-helper.options')) || {}
    };

    const options = writable(defaultOptions);

    options.subscribe(options => localStorage.setItem('__routify-helper.options', JSON.stringify(options)));

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function crossfade(_a) {
        var { fallback } = _a, defaults = __rest(_a, ["fallback"]);
        const to_receive = new Map();
        const to_send = new Map();
        function crossfade(from, node, params) {
            const { delay = 0, duration = d => Math.sqrt(d) * 30, easing = cubicOut } = assign(assign({}, defaults), params);
            const to = node.getBoundingClientRect();
            const dx = from.left - to.left;
            const dy = from.top - to.top;
            const dw = from.width / to.width;
            const dh = from.height / to.height;
            const d = Math.sqrt(dx * dx + dy * dy);
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            const opacity = +style.opacity;
            return {
                delay,
                duration: is_function(duration) ? duration(d) : duration,
                easing,
                css: (t, u) => `
				opacity: ${t * opacity};
				transform-origin: top left;
				transform: ${transform} translate(${u * dx}px,${u * dy}px) scale(${t + (1 - t) * dw}, ${t + (1 - t) * dh});
			`
            };
        }
        function transition(items, counterparts, intro) {
            return (node, params) => {
                items.set(params.key, {
                    rect: node.getBoundingClientRect()
                });
                return () => {
                    if (counterparts.has(params.key)) {
                        const { rect } = counterparts.get(params.key);
                        counterparts.delete(params.key);
                        return crossfade(rect, node, params);
                    }
                    // if the node is disappearing altogether
                    // (i.e. wasn't claimed by the other list)
                    // then we need to supply an outro
                    items.delete(params.key);
                    return fallback && fallback(node, params, intro);
                };
            };
        }
        return [
            transition(to_send, to_receive, false),
            transition(to_receive, to_send, true)
        ];
    }

    function flip(node, animation, params) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const scaleX = animation.from.width / node.clientWidth;
        const scaleY = animation.from.height / node.clientHeight;
        const dx = (animation.from.left - animation.to.left) / scaleX;
        const dy = (animation.from.top - animation.to.top) / scaleY;
        const d = Math.sqrt(dx * dx + dy * dy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(d) : duration,
            easing,
            css: (_t, u) => `transform: ${transform} translate(${u * dx}px, ${u * dy}px);`
        };
    }

    /* C:\Users\jakob\sandbox\svelte\dev\routify-helper\src\components\tree\Dir.svelte generated by Svelte v3.22.2 */
    const file$2 = "C:\\Users\\jakob\\sandbox\\svelte\\dev\\routify-helper\\src\\components\\tree\\Dir.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (29:2) {#each node.children      .filter(filter)      .sort(sorter) as _node (_node.absolutePath)}
    function create_each_block$2(key_1, ctx) {
    	let li;
    	let t;
    	let li_intro;
    	let li_outro;
    	let rect;
    	let stop_animation = noop;
    	let current;

    	const file_1 = new /*File*/ ctx[1]({
    			props: {
    				node: /*_node*/ ctx[4],
    				dir: /*node*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			li = element("li");
    			create_component(file_1.$$.fragment);
    			t = space();
    			this.h();
    		},
    		l: function claim(nodes) {
    			li = claim_element(nodes, "LI", { class: true });
    			var li_nodes = children(li);
    			claim_component(file_1.$$.fragment, li_nodes);
    			t = claim_space(li_nodes);
    			li_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(li, "class", "file-container svelte-8xvkdr");
    			add_location(li, file$2, 31, 4, 628);
    			this.first = li;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(file_1, li, null);
    			append_dev(li, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const file_1_changes = {};
    			if (dirty & /*node*/ 1) file_1_changes.node = /*_node*/ ctx[4];
    			if (dirty & /*node*/ 1) file_1_changes.dir = /*node*/ ctx[0];
    			file_1.$set(file_1_changes);
    		},
    		r: function measure() {
    			rect = li.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(li);
    			stop_animation();
    			add_transform(li, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(li, rect, flip, {});
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(file_1.$$.fragment, local);

    			add_render_callback(() => {
    				if (li_outro) li_outro.end(1);
    				if (!li_intro) li_intro = create_in_transition(li, /*receive*/ ctx[3], { key: /*_node*/ ctx[4].absolutePath });
    				li_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(file_1.$$.fragment, local);
    			if (li_intro) li_intro.invalidate();
    			li_outro = create_out_transition(li, /*send*/ ctx[2], { key: /*_node*/ ctx[4].absolutePath });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(file_1);
    			if (detaching && li_outro) li_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(29:2) {#each node.children      .filter(filter)      .sort(sorter) as _node (_node.absolutePath)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*node*/ ctx[0].children.filter(filter).sort(sorter);
    	validate_each_argument(each_value);
    	const get_key = ctx => /*_node*/ ctx[4].absolutePath;
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			this.h();
    		},
    		l: function claim(nodes) {
    			ul = claim_element(nodes, "UL", { class: true });
    			var ul_nodes = children(ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(ul_nodes);
    			}

    			ul_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(ul, "class", "folder svelte-8xvkdr");
    			add_location(ul, file$2, 27, 0, 508);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*node, filter, sorter*/ 1) {
    				const each_value = /*node*/ ctx[0].children.filter(filter).sort(sorter);
    				validate_each_argument(each_value);
    				group_outros();
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, fix_and_outro_and_destroy_block, create_each_block$2, null, get_each_context$2);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function sorter(a, b) {
    	return a.ownMeta.index - b.ownMeta.index;
    }

    function filter(a) {
    	return a.isPage || a.isDir;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { node } = $$props;
    	const { File } = getContext("treeCmps");
    	const [send, receive] = crossfade({});
    	const writable_props = ["node"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Dir> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Dir", $$slots, []);

    	$$self.$set = $$props => {
    		if ("node" in $$props) $$invalidate(0, node = $$props.node);
    	};

    	$$self.$capture_state = () => ({
    		node,
    		crossfade,
    		flip,
    		getContext,
    		File,
    		send,
    		receive,
    		sorter,
    		filter
    	});

    	$$self.$inject_state = $$props => {
    		if ("node" in $$props) $$invalidate(0, node = $$props.node);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [node, File, send, receive];
    }

    class Dir extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { node: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dir",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*node*/ ctx[0] === undefined && !("node" in props)) {
    			console.warn("<Dir> was created without expected prop 'node'");
    		}
    	}

    	get node() {
    		throw new Error("<Dir>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set node(value) {
    		throw new Error("<Dir>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * @typedef {object} Node
     * @prop {string} path
     * @prop {Node} api
     * @prop {string} file
     * @prop {string} filepath
     * @prop {string} absolutePath
     * @prop {boolean} isDir
     * @prop {boolean} isPage
     * @prop {boolean} isFile
     * @prop {object} ownMeta
     * @prop {Node[]=} children
     * @prop {Node=} parent
     */

    const handleDrag = async function handleDrag(from, to, position) {
        const treeStore = getContext('treeStore');
        const Tree = get_store_value(treeStore);

        const oldFilePath = from.dataset.nodePath;
        const dirPath = to.dataset.nodeDir;
        const sibling = to.dataset.nodeFile;

        const dirNode = getFile(Tree, dirPath);
        const fileNode = getFile(Tree, oldFilePath);
        const oldDest = fileNode.absolutePath;
        fileNode.absolutePath = `${dirNode.absolutePath}/${fileNode.file}`;

        // remove from old dir (even if not moved)
        const oldIndex = fileNode.parent.children.indexOf(fileNode);
        fileNode.parent.children.splice(oldIndex, 1);

        // insert node at new index position
        const children = dirNode.children.filter(filter$1).sort(sorter$1);
        const siblingIndex = children.findIndex(node => node.file === sibling) || 0;
        const index = position === 'under' ? siblingIndex + 1 : siblingIndex;
        children.splice(index, 0, fileNode);


        updateindexes(children);

        if (fileNode.absolutePath !== oldDest) {
            moveFile(oldDest, fileNode.absolutePath);
        }
        
        for (let node of children.filter(n => n.isPage || n.isDir)) {
            const suffix = node.isDir ? "/_layout.svelte" : "";
            await writeFile(node.absolutePath + suffix, node.ownMeta);
        }
        
        // insert in tree for animation effect
        dirNode.children.push(fileNode);
        treeStore.set(Tree);

        return true
    };


    /**
     * @param {Node} node 
     * @param {string} filepath 
     * @returns {Node}
     */
    function getFile(node, filepath, state = {}) {
        state.node = state.node || (node.filepath === filepath) && node;
        (node.children || []).filter(n => n.isDir || n.isFile).forEach(_node => getFile(_node, filepath, state));
        return state.node
    }


    /** @param {Node[]} nodes */
    function updateindexes(nodes) {
        let index = 100;
        nodes.forEach(node => {
            console.log(node.path);
            if (node.ownMeta.index !== false) {
                node.ownMeta.index = index;
                index = index + 100;
            }
        });
    }

    function sorter$1(a, b) { return a.ownMeta.index - b.ownMeta.index }
    function filter$1(a) { return a.isPage || a.isDir }

    /* C:\Users\jakob\sandbox\svelte\dev\routify-helper\src\components\tree\File.svelte generated by Svelte v3.22.2 */
    const file$3 = "C:\\Users\\jakob\\sandbox\\svelte\\dev\\routify-helper\\src\\components\\tree\\File.svelte";

    // (113:4) {#if $options.showIndex}
    function create_if_block_1$1(ctx) {
    	let span;
    	let t_value = /*node*/ ctx[0].ownMeta.index + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			this.h();
    		},
    		l: function claim(nodes) {
    			span = claim_element(nodes, "SPAN", { class: true });
    			var span_nodes = children(span);
    			t = claim_text(span_nodes, t_value);
    			span_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(span, "class", "index svelte-1oj7ydv");
    			add_location(span, file$3, 113, 6, 2862);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*node*/ 1 && t_value !== (t_value = /*node*/ ctx[0].ownMeta.index + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(113:4) {#if $options.showIndex}",
    		ctx
    	});

    	return block;
    }

    // (118:2) {#if node.children && node.children.length}
    function create_if_block$2(ctx) {
    	let current;

    	const dir_1 = new /*Dir*/ ctx[3]({
    			props: { node: /*node*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dir_1.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(dir_1.$$.fragment, nodes);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dir_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dir_1_changes = {};
    			if (dirty & /*node*/ 1) dir_1_changes.node = /*node*/ ctx[0];
    			dir_1.$set(dir_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dir_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dir_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dir_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(118:2) {#if node.children && node.children.length}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let t1_value = (/*node*/ ctx[0].api.title || /*node*/ ctx[0].file) + "";
    	let t1;
    	let t2;
    	let div1_data_node_path_value;
    	let div1_data_node_file_value;
    	let div1_data_node_index_value;
    	let div1_data_node_dir_value;
    	let current;
    	let dispose;
    	let if_block0 = /*$options*/ ctx[2].showIndex && create_if_block_1$1(ctx);
    	let if_block1 = /*node*/ ctx[0].children && /*node*/ ctx[0].children.length && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			if (if_block1) if_block1.c();
    			this.h();
    		},
    		l: function claim(nodes) {
    			div1 = claim_element(nodes, "DIV", {
    				class: true,
    				draggable: true,
    				"data-node": true,
    				"data-node-path": true,
    				"data-node-file": true,
    				"data-node-index": true,
    				"data-node-dir": true
    			});

    			var div1_nodes = children(div1);
    			div0 = claim_element(div1_nodes, "DIV", { class: true });
    			var div0_nodes = children(div0);
    			if (if_block0) if_block0.l(div0_nodes);
    			t0 = claim_space(div0_nodes);
    			t1 = claim_text(div0_nodes, t1_value);
    			div0_nodes.forEach(detach_dev);
    			t2 = claim_space(div1_nodes);
    			if (if_block1) if_block1.l(div1_nodes);
    			div1_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(div0, "class", "file-display svelte-1oj7ydv");
    			add_location(div0, file$3, 109, 2, 2734);
    			attr_dev(div1, "class", "file svelte-1oj7ydv");
    			attr_dev(div1, "draggable", "true");
    			attr_dev(div1, "data-node", /*node*/ ctx[0]);
    			attr_dev(div1, "data-node-path", div1_data_node_path_value = /*node*/ ctx[0].filepath);
    			attr_dev(div1, "data-node-file", div1_data_node_file_value = /*node*/ ctx[0].file);
    			attr_dev(div1, "data-node-index", div1_data_node_index_value = /*node*/ ctx[0].ownMeta.index);
    			attr_dev(div1, "data-node-dir", div1_data_node_dir_value = /*dir*/ ctx[1].filepath);
    			toggle_class(div1, "draggable", /*node*/ ctx[0].ownMeta.index !== false);
    			add_location(div1, file$3, 93, 0, 2318);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div1, t2);
    			if (if_block1) if_block1.m(div1, null);
    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(div0, "click", /*click_handler*/ ctx[13], false, false, false),
    				listen_dev(div1, "dragstart", /*dragstart*/ ctx[6], false, false, false),
    				listen_dev(div1, "dragover", /*dragover*/ ctx[4], false, false, false),
    				listen_dev(div1, "dragleave", /*dragleave*/ ctx[5], false, false, false),
    				listen_dev(div1, "dragend", /*dragend*/ ctx[8], false, false, false),
    				listen_dev(div1, "drop", /*drop*/ ctx[7], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$options*/ ctx[2].showIndex) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					if_block0.m(div0, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if ((!current || dirty & /*node*/ 1) && t1_value !== (t1_value = (/*node*/ ctx[0].api.title || /*node*/ ctx[0].file) + "")) set_data_dev(t1, t1_value);

    			if (/*node*/ ctx[0].children && /*node*/ ctx[0].children.length) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*node*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*node*/ 1) {
    				attr_dev(div1, "data-node", /*node*/ ctx[0]);
    			}

    			if (!current || dirty & /*node*/ 1 && div1_data_node_path_value !== (div1_data_node_path_value = /*node*/ ctx[0].filepath)) {
    				attr_dev(div1, "data-node-path", div1_data_node_path_value);
    			}

    			if (!current || dirty & /*node*/ 1 && div1_data_node_file_value !== (div1_data_node_file_value = /*node*/ ctx[0].file)) {
    				attr_dev(div1, "data-node-file", div1_data_node_file_value);
    			}

    			if (!current || dirty & /*node*/ 1 && div1_data_node_index_value !== (div1_data_node_index_value = /*node*/ ctx[0].ownMeta.index)) {
    				attr_dev(div1, "data-node-index", div1_data_node_index_value);
    			}

    			if (!current || dirty & /*dir*/ 2 && div1_data_node_dir_value !== (div1_data_node_dir_value = /*dir*/ ctx[1].filepath)) {
    				attr_dev(div1, "data-node-dir", div1_data_node_dir_value);
    			}

    			if (dirty & /*node*/ 1) {
    				toggle_class(div1, "draggable", /*node*/ ctx[0].ownMeta.index !== false);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $draggedFile;
    	let $options;
    	validate_store(draggedFile, "draggedFile");
    	component_subscribe($$self, draggedFile, $$value => $$invalidate(10, $draggedFile = $$value));
    	validate_store(options, "options");
    	component_subscribe($$self, options, $$value => $$invalidate(2, $options = $$value));
    	let { node } = $$props, { dir } = $$props;
    	const { Dir } = getContext("treeCmps");
    	const styles = ["dragged-over", "dragged-under", "dragged-in"];
    	let draggedItem = null;
    	let position = null;

    	function dragover(e) {
    		const { target, srcElement, toElement } = e;
    		if (!target.dataset.nodeDir) return false;
    		if ($draggedFile.dataset.nodeDir !== target.dataset.nodeDir) return false;
    		e.stopPropagation();
    		e.preventDefault();
    		const y = e.clientY;
    		const top = target.getBoundingClientRect().top;
    		const height = target.getBoundingClientRect().height;
    		const inTop = y < top + height / 2;
    		position = inTop ? "over" : "under";
    		target.classList.remove(...styles);
    		if (inTop) target.classList.add("dragged-over"); else target.classList.add("dragged-under");
    	}

    	function dragleave(ev) {
    		ev.stopPropagation();
    		ev.target.classList.remove(...styles);
    	}

    	function dragstart(e) {
    		if (e.target.dataset.nodeIndex === "false") return false;
    		set_store_value(draggedFile, $draggedFile = e.target);
    		e.stopPropagation();
    	}

    	function drop(e) {
    		e.stopPropagation();
    		e.preventDefault();
    		if (!e.target.dataset.nodeDir) return false;
    		handleDrag($draggedFile, e.target, position);
    		e.target.classList.remove(...styles);
    	}

    	function dragend() {
    		set_store_value(draggedFile, $draggedFile = null);
    	}

    	const writable_props = ["node", "dir"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<File> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("File", $$slots, []);
    	const click_handler = () => history.pushState({}, "", node.path);

    	$$self.$set = $$props => {
    		if ("node" in $$props) $$invalidate(0, node = $$props.node);
    		if ("dir" in $$props) $$invalidate(1, dir = $$props.dir);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		draggedFile,
    		state,
    		options,
    		goto,
    		isActive,
    		handleDrag,
    		node,
    		dir,
    		Dir,
    		styles,
    		draggedItem,
    		position,
    		dragover,
    		dragleave,
    		dragstart,
    		drop,
    		dragend,
    		$draggedFile,
    		$options
    	});

    	$$self.$inject_state = $$props => {
    		if ("node" in $$props) $$invalidate(0, node = $$props.node);
    		if ("dir" in $$props) $$invalidate(1, dir = $$props.dir);
    		if ("draggedItem" in $$props) draggedItem = $$props.draggedItem;
    		if ("position" in $$props) position = $$props.position;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		node,
    		dir,
    		$options,
    		Dir,
    		dragover,
    		dragleave,
    		dragstart,
    		drop,
    		dragend,
    		position,
    		$draggedFile,
    		styles,
    		draggedItem,
    		click_handler
    	];
    }

    class File extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { node: 0, dir: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "File",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*node*/ ctx[0] === undefined && !("node" in props)) {
    			console.warn("<File> was created without expected prop 'node'");
    		}

    		if (/*dir*/ ctx[1] === undefined && !("dir" in props)) {
    			console.warn("<File> was created without expected prop 'dir'");
    		}
    	}

    	get node() {
    		throw new Error("<File>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set node(value) {
    		throw new Error("<File>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dir() {
    		throw new Error("<File>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dir(value) {
    		throw new Error("<File>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* C:\Users\jakob\sandbox\svelte\dev\routify-helper\src\components\tree\Tree.svelte generated by Svelte v3.22.2 */

    // (10:0) {#if tree}
    function create_if_block$3(ctx) {
    	let current;

    	const dir = new Dir({
    			props: { node: /*tree*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dir.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(dir.$$.fragment, nodes);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dir, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dir_changes = {};
    			if (dirty & /*tree*/ 1) dir_changes.node = /*tree*/ ctx[0];
    			dir.$set(dir_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dir.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dir.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dir, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(10:0) {#if tree}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*tree*/ ctx[0] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			if (if_block) if_block.l(nodes);
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*tree*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*tree*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { tree } = $$props;
    	setContext("treeCmps", { File, Dir });
    	const writable_props = ["tree"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tree> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Tree", $$slots, []);

    	$$self.$set = $$props => {
    		if ("tree" in $$props) $$invalidate(0, tree = $$props.tree);
    	};

    	$$self.$capture_state = () => ({ setContext, Dir, File, tree });

    	$$self.$inject_state = $$props => {
    		if ("tree" in $$props) $$invalidate(0, tree = $$props.tree);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [tree];
    }

    class Tree extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { tree: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tree",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*tree*/ ctx[0] === undefined && !("tree" in props)) {
    			console.warn("<Tree> was created without expected prop 'tree'");
    		}
    	}

    	get tree() {
    		throw new Error("<Tree>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tree(value) {
    		throw new Error("<Tree>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* C:\Users\jakob\sandbox\svelte\dev\routify-helper\src\components\file\JsonBox.svelte generated by Svelte v3.22.2 */
    const file$4 = "C:\\Users\\jakob\\sandbox\\svelte\\dev\\routify-helper\\src\\components\\file\\JsonBox.svelte";

    // (89:0) {#if $ready}
    function create_if_block$4(ctx) {
    	let div;
    	let attachEditor_action;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			this.h();
    		},
    		l: function claim(nodes) {
    			div = claim_element(nodes, "DIV", { style: true });
    			children(div).forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			set_style(div, "width", "auto");
    			add_location(div, file$4, 89, 2, 2727);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div, anchor);
    			if (remount) dispose();
    			dispose = action_destroyer(attachEditor_action = /*attachEditor*/ ctx[1].call(null, div));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(89:0) {#if $ready}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let if_block_anchor;
    	let if_block = /*$ready*/ ctx[0] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			if (if_block) if_block.l(nodes);
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$ready*/ ctx[0]) {
    				if (if_block) ; else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    let ready$1 = writable(false);
    const s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.19.2/min/vs/loader.min.js";
    s.crossOrigin = true;
    s.onload = setEnvironment;
    document.getElementsByTagName("head")[0].append(s);

    function setEnvironment() {
    	require.config({
    		paths: {
    			vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.19.2/min/vs"
    		}
    	});

    	window.MonacoEnvironment = {
    		getWorkerUrl(workerId, label) {
    			return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
        self.MonacoEnvironment = {
          baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.19.2/min'
        };
        importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.19.2/min/vs/base/worker/workerMain.js');`)}`;
    		}
    	};

    	ready$1.set(true);
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $ready;
    	validate_store(ready$1, "ready");
    	component_subscribe($$self, ready$1, $$value => $$invalidate(0, $ready = $$value));
    	let { value = "" } = $$props;

    	function attachEditor(e) {
    		require(["vs/editor/editor.main"], function () {
    			let editor = monaco.editor.create(e, {
    				value: JSON.stringify(value, null, 2),
    				overviewRulerBorder: false,
    				overviewRulerLanes: 0,
    				hideCursorInOverviewRuler: true,
    				renderLineHighlight: false,
    				language: "json",
    				lineNumbers: "off",
    				lineHeight: 18,
    				fontSize: 16,
    				fontWeight: 1,
    				scrollbar: {
    					alwaysConsumeMouseWheel: false,
    					vertical: "hidden"
    				},
    				formatOnType: true,
    				scrollBeyondLastLine: false,
    				folding: false,
    				minimap: { enabled: false }
    			});

    			editor.onDidChangeModelContent((e, b) => {
    				$$invalidate(2, value = editor.getValue());
    			});

    			editor.onDidChangeModelDecorations(() => {
    				updateEditorHeight(); // typing
    				requestAnimationFrame(updateEditorHeight); // folding
    			});

    			let prevHeight = 0;
    			updateEditorHeight();

    			function updateEditorHeight() {
    				const editorElement = editor.getDomNode();

    				if (!editorElement) {
    					return;
    				}

    				const lineHeight = editor.getOption(12);
    				const lineCount = editor.getModel() && editor.getModel().getLineCount() || 1;
    				const height = editor.getTopForLineNumber(lineCount + 1) + lineHeight;

    				if (prevHeight !== height) {
    					prevHeight = height;
    					e.style.height = `${height + 28}px`;
    					editor.layout();
    				}
    			}
    		});
    	}

    	const writable_props = ["value"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<JsonBox> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("JsonBox", $$slots, []);

    	$$self.$set = $$props => {
    		if ("value" in $$props) $$invalidate(2, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({
    		writable,
    		ready: ready$1,
    		s,
    		setEnvironment,
    		value,
    		attachEditor,
    		$ready
    	});

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(2, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$ready, attachEditor, value];
    }

    class JsonBox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { value: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "JsonBox",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get value() {
    		throw new Error("<JsonBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<JsonBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* C:\Users\jakob\sandbox\svelte\dev\routify-helper\src\components\file\Input.svelte generated by Svelte v3.22.2 */
    const file$5 = "C:\\Users\\jakob\\sandbox\\svelte\\dev\\routify-helper\\src\\components\\file\\Input.svelte";

    // (57:2) {:else}
    function create_else_block(ctx) {
    	let input;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			this.h();
    		},
    		l: function claim(nodes) {
    			input = claim_element(nodes, "INPUT", {
    				type: true,
    				placeholder: true,
    				class: true
    			});

    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", /*placeholder*/ ctx[2]);
    			attr_dev(input, "class", "svelte-rdw8kx");
    			add_location(input, file$5, 57, 4, 1355);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[0]);
    			if (remount) dispose();
    			dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[8]);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*placeholder*/ 4) {
    				attr_dev(input, "placeholder", /*placeholder*/ ctx[2]);
    			}

    			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(57:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (55:31) 
    function create_if_block_1$2(ctx) {
    	let input;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			this.h();
    		},
    		l: function claim(nodes) {
    			input = claim_element(nodes, "INPUT", { type: true, class: true });
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "svelte-rdw8kx");
    			add_location(input, file$5, 55, 4, 1302);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[0]);
    			if (remount) dispose();
    			dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[7]);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*value*/ 1) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(55:31) ",
    		ctx
    	});

    	return block;
    }

    // (50:2) {#if type === 'json'}
    function create_if_block$5(ctx) {
    	let div;
    	let updating_value;
    	let current;

    	function jsonbox_value_binding(value) {
    		/*jsonbox_value_binding*/ ctx[6].call(null, value);
    	}

    	let jsonbox_props = { name: /*name*/ ctx[1] };

    	if (/*value*/ ctx[0] !== void 0) {
    		jsonbox_props.value = /*value*/ ctx[0];
    	}

    	const jsonbox = new JsonBox({ props: jsonbox_props, $$inline: true });
    	binding_callbacks.push(() => bind(jsonbox, "value", jsonbox_value_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(jsonbox.$$.fragment);
    			this.h();
    		},
    		l: function claim(nodes) {
    			div = claim_element(nodes, "DIV", { class: true });
    			var div_nodes = children(div);
    			claim_component(jsonbox.$$.fragment, div_nodes);
    			div_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(div, "class", "json svelte-rdw8kx");
    			add_location(div, file$5, 50, 4, 1188);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(jsonbox, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const jsonbox_changes = {};
    			if (dirty & /*name*/ 2) jsonbox_changes.name = /*name*/ ctx[1];

    			if (!updating_value && dirty & /*value*/ 1) {
    				updating_value = true;
    				jsonbox_changes.value = /*value*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			jsonbox.$set(jsonbox_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(jsonbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(jsonbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(jsonbox);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(50:2) {#if type === 'json'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div;
    	let h5;
    	let t0;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$5, create_if_block_1$2, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*type*/ ctx[3] === "json") return 0;
    		if (/*type*/ ctx[3] === "boolean") return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h5 = element("h5");
    			t0 = text(/*name*/ ctx[1]);
    			t1 = space();
    			if_block.c();
    			this.h();
    		},
    		l: function claim(nodes) {
    			div = claim_element(nodes, "DIV", { style: true, class: true });
    			var div_nodes = children(div);
    			h5 = claim_element(div_nodes, "H5", { class: true });
    			var h5_nodes = children(h5);
    			t0 = claim_text(h5_nodes, /*name*/ ctx[1]);
    			h5_nodes.forEach(detach_dev);
    			t1 = claim_space(div_nodes);
    			if_block.l(div_nodes);
    			div_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(h5, "class", "svelte-rdw8kx");
    			add_location(h5, file$5, 47, 2, 1106);
    			attr_dev(div, "class", "svelte-rdw8kx");
    			add_location(div, file$5, 46, 0, 1088);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h5);
    			append_dev(h5, t0);
    			append_dev(div, t1);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*name*/ 2) set_data_dev(t0, /*name*/ ctx[1]);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { value = "" } = $$props;
    	let { name } = $$props;
    	let { placeholder = "" } = $$props;

    	const configs = {
    		title: { type: "string" },
    		index: { type: "string" },
    		preload: { type: "boolean" },
    		bundle: { type: "boolean" },
    		"precache-order": { type: "ignore" },
    		"precache-proximity": { type: "ignore" },
    		recursive: { type: "ignore" }
    	};

    	const writable_props = ["value", "name", "placeholder"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Input> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Input", $$slots, []);

    	function jsonbox_value_binding(value$1) {
    		value = value$1;
    		$$invalidate(0, value);
    	}

    	function input_change_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	$$self.$set = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("placeholder" in $$props) $$invalidate(2, placeholder = $$props.placeholder);
    	};

    	$$self.$capture_state = () => ({
    		JsonBox,
    		value,
    		name,
    		placeholder,
    		configs,
    		config,
    		type
    	});

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("placeholder" in $$props) $$invalidate(2, placeholder = $$props.placeholder);
    		if ("config" in $$props) $$invalidate(4, config = $$props.config);
    		if ("type" in $$props) $$invalidate(3, type = $$props.type);
    	};

    	let config;
    	let type;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*name*/ 2) {
    			 $$invalidate(4, config = configs[name] || {});
    		}

    		if ($$self.$$.dirty & /*config*/ 16) {
    			 $$invalidate(3, type = config.type || "json");
    		}
    	};

    	return [
    		value,
    		name,
    		placeholder,
    		type,
    		config,
    		configs,
    		jsonbox_value_binding,
    		input_change_handler,
    		input_input_handler
    	];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { value: 0, name: 1, placeholder: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[1] === undefined && !("name" in props)) {
    			console.warn("<Input> was created without expected prop 'name'");
    		}
    	}

    	get value() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* C:\Users\jakob\sandbox\svelte\dev\routify-helper\src\components\file\AddMeta.svelte generated by Svelte v3.22.2 */

    const { console: console_1 } = globals;
    const file$6 = "C:\\Users\\jakob\\sandbox\\svelte\\dev\\routify-helper\\src\\components\\file\\AddMeta.svelte";

    function create_fragment$8(ctx) {
    	let form;
    	let input;
    	let t0;
    	let button;
    	let t1;
    	let dispose;

    	const block = {
    		c: function create() {
    			form = element("form");
    			input = element("input");
    			t0 = space();
    			button = element("button");
    			t1 = text("Add meta");
    			this.h();
    		},
    		l: function claim(nodes) {
    			form = claim_element(nodes, "FORM", { action: true });
    			var form_nodes = children(form);
    			input = claim_element(form_nodes, "INPUT", { type: true });
    			t0 = claim_space(form_nodes);
    			button = claim_element(form_nodes, "BUTTON", {});
    			var button_nodes = children(button);
    			t1 = claim_text(button_nodes, "Add meta");
    			button_nodes.forEach(detach_dev);
    			form_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(input, "type", "text");
    			add_location(input, file$6, 12, 2, 273);
    			add_location(button, file$6, 13, 2, 316);
    			attr_dev(form, "action", "");
    			add_location(form, file$6, 10, 0, 211);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, form, anchor);
    			append_dev(form, input);
    			set_input_value(input, /*name*/ ctx[0]);
    			append_dev(form, t0);
    			append_dev(form, button);
    			append_dev(button, t1);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "input", /*input_input_handler*/ ctx[4]),
    				listen_dev(form, "submit", prevent_default(/*handleSubmit*/ ctx[1]), false, true, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 1 && input.value !== /*name*/ ctx[0]) {
    				set_input_value(input, /*name*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { userInputs } = $$props;
    	let showDialog = false;
    	let name = "";

    	function handleSubmit() {
    		console.log("hello");
    		$$invalidate(2, userInputs = [...userInputs, { name, value: null }]);
    	}

    	const writable_props = ["userInputs"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<AddMeta> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("AddMeta", $$slots, []);

    	function input_input_handler() {
    		name = this.value;
    		$$invalidate(0, name);
    	}

    	$$self.$set = $$props => {
    		if ("userInputs" in $$props) $$invalidate(2, userInputs = $$props.userInputs);
    	};

    	$$self.$capture_state = () => ({
    		userInputs,
    		showDialog,
    		name,
    		handleSubmit
    	});

    	$$self.$inject_state = $$props => {
    		if ("userInputs" in $$props) $$invalidate(2, userInputs = $$props.userInputs);
    		if ("showDialog" in $$props) showDialog = $$props.showDialog;
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, handleSubmit, userInputs, showDialog, input_input_handler];
    }

    class AddMeta extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { userInputs: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AddMeta",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*userInputs*/ ctx[2] === undefined && !("userInputs" in props)) {
    			console_1.warn("<AddMeta> was created without expected prop 'userInputs'");
    		}
    	}

    	get userInputs() {
    		throw new Error("<AddMeta>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set userInputs(value) {
    		throw new Error("<AddMeta>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* C:\Users\jakob\sandbox\svelte\dev\routify-helper\src\components\file\File.svelte generated by Svelte v3.22.2 */

    const { Object: Object_1$1 } = globals;
    const file_1 = "C:\\Users\\jakob\\sandbox\\svelte\\dev\\routify-helper\\src\\components\\file\\File.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i].name;
    	child_ctx[13] = list[i].value;
    	child_ctx[14] = list;
    	child_ctx[15] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i].name;
    	child_ctx[13] = list[i].value;
    	child_ctx[16] = list;
    	child_ctx[17] = i;
    	return child_ctx;
    }

    // (39:0) {#if meta}
    function create_if_block$6(ctx) {
    	let updating_userInputs;
    	let t0;
    	let section0;
    	let h1;
    	let t1_value = /*file*/ ctx[2].api.title + "";
    	let t1;
    	let t2;
    	let div;
    	let span;
    	let t3_value = /*file*/ ctx[2].filepath + "";
    	let t3;
    	let t4;
    	let section1;
    	let form;
    	let fieldset;
    	let legend;
    	let t5;
    	let t6;
    	let updating_value;
    	let t7;
    	let t8;
    	let current;

    	function addmeta_userInputs_binding(value) {
    		/*addmeta_userInputs_binding*/ ctx[8].call(null, value);
    	}

    	let addmeta_props = {};

    	if (/*userInputs*/ ctx[0] !== void 0) {
    		addmeta_props.userInputs = /*userInputs*/ ctx[0];
    	}

    	const addmeta = new AddMeta({ props: addmeta_props, $$inline: true });
    	binding_callbacks.push(() => bind(addmeta, "userInputs", addmeta_userInputs_binding));

    	function input_value_binding(value) {
    		/*input_value_binding*/ ctx[9].call(null, value);
    	}

    	let input_props = {
    		name: "title",
    		placeholder: /*file*/ ctx[2].api.title
    	};

    	if (/*ownMeta*/ ctx[3].title !== void 0) {
    		input_props.value = /*ownMeta*/ ctx[3].title;
    	}

    	const input = new Input({ props: input_props, $$inline: true });
    	binding_callbacks.push(() => bind(input, "value", input_value_binding));
    	let each_value_1 = /*userInputs*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*inheritedInputs*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			create_component(addmeta.$$.fragment);
    			t0 = space();
    			section0 = element("section");
    			h1 = element("h1");
    			t1 = text(t1_value);
    			t2 = space();
    			div = element("div");
    			span = element("span");
    			t3 = text(t3_value);
    			t4 = space();
    			section1 = element("section");
    			form = element("form");
    			fieldset = element("fieldset");
    			legend = element("legend");
    			t5 = text("Entries");
    			t6 = space();
    			create_component(input.$$.fragment);
    			t7 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t8 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			this.h();
    		},
    		l: function claim(nodes) {
    			claim_component(addmeta.$$.fragment, nodes);
    			t0 = claim_space(nodes);
    			section0 = claim_element(nodes, "SECTION", { class: true });
    			var section0_nodes = children(section0);
    			h1 = claim_element(section0_nodes, "H1", {});
    			var h1_nodes = children(h1);
    			t1 = claim_text(h1_nodes, t1_value);
    			h1_nodes.forEach(detach_dev);
    			t2 = claim_space(section0_nodes);
    			div = claim_element(section0_nodes, "DIV", {});
    			var div_nodes = children(div);
    			span = claim_element(div_nodes, "SPAN", {});
    			var span_nodes = children(span);
    			t3 = claim_text(span_nodes, t3_value);
    			span_nodes.forEach(detach_dev);
    			div_nodes.forEach(detach_dev);
    			section0_nodes.forEach(detach_dev);
    			t4 = claim_space(nodes);
    			section1 = claim_element(nodes, "SECTION", { class: true });
    			var section1_nodes = children(section1);
    			form = claim_element(section1_nodes, "FORM", { action: true });
    			var form_nodes = children(form);
    			fieldset = claim_element(form_nodes, "FIELDSET", {});
    			var fieldset_nodes = children(fieldset);
    			legend = claim_element(fieldset_nodes, "LEGEND", {});
    			var legend_nodes = children(legend);
    			t5 = claim_text(legend_nodes, "Entries");
    			legend_nodes.forEach(detach_dev);
    			t6 = claim_space(fieldset_nodes);
    			claim_component(input.$$.fragment, fieldset_nodes);
    			t7 = claim_space(fieldset_nodes);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].l(fieldset_nodes);
    			}

    			t8 = claim_space(fieldset_nodes);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(fieldset_nodes);
    			}

    			fieldset_nodes.forEach(detach_dev);
    			form_nodes.forEach(detach_dev);
    			section1_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			add_location(h1, file_1, 41, 4, 937);
    			add_location(span, file_1, 43, 6, 981);
    			add_location(div, file_1, 42, 4, 968);
    			attr_dev(section0, "class", "svelte-ltn7b2");
    			add_location(section0, file_1, 40, 2, 922);
    			add_location(legend, file_1, 49, 8, 1098);
    			add_location(fieldset, file_1, 48, 6, 1078);
    			attr_dev(form, "action", "");
    			add_location(form, file_1, 47, 4, 1054);
    			attr_dev(section1, "class", "svelte-ltn7b2");
    			add_location(section1, file_1, 46, 2, 1039);
    		},
    		m: function mount(target, anchor) {
    			mount_component(addmeta, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, section0, anchor);
    			append_dev(section0, h1);
    			append_dev(h1, t1);
    			append_dev(section0, t2);
    			append_dev(section0, div);
    			append_dev(div, span);
    			append_dev(span, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, section1, anchor);
    			append_dev(section1, form);
    			append_dev(form, fieldset);
    			append_dev(fieldset, legend);
    			append_dev(legend, t5);
    			append_dev(fieldset, t6);
    			mount_component(input, fieldset, null);
    			append_dev(fieldset, t7);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(fieldset, null);
    			}

    			append_dev(fieldset, t8);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(fieldset, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const addmeta_changes = {};

    			if (!updating_userInputs && dirty & /*userInputs*/ 1) {
    				updating_userInputs = true;
    				addmeta_changes.userInputs = /*userInputs*/ ctx[0];
    				add_flush_callback(() => updating_userInputs = false);
    			}

    			addmeta.$set(addmeta_changes);
    			if ((!current || dirty & /*file*/ 4) && t1_value !== (t1_value = /*file*/ ctx[2].api.title + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*file*/ 4) && t3_value !== (t3_value = /*file*/ ctx[2].filepath + "")) set_data_dev(t3, t3_value);
    			const input_changes = {};
    			if (dirty & /*file*/ 4) input_changes.placeholder = /*file*/ ctx[2].api.title;

    			if (!updating_value && dirty & /*ownMeta*/ 8) {
    				updating_value = true;
    				input_changes.value = /*ownMeta*/ ctx[3].title;
    				add_flush_callback(() => updating_value = false);
    			}

    			input.$set(input_changes);

    			if (dirty & /*userInputs*/ 1) {
    				each_value_1 = /*userInputs*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1$1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(fieldset, t8);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*inheritedInputs*/ 2) {
    				each_value = /*inheritedInputs*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(fieldset, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(addmeta.$$.fragment, local);
    			transition_in(input.$$.fragment, local);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(addmeta.$$.fragment, local);
    			transition_out(input.$$.fragment, local);
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(addmeta, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(section0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(section1);
    			destroy_component(input);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(39:0) {#if meta}",
    		ctx
    	});

    	return block;
    }

    // (57:8) {#each userInputs as { name, value }}
    function create_each_block_1$1(ctx) {
    	let updating_value;
    	let current;

    	function input_value_binding_1(value) {
    		/*input_value_binding_1*/ ctx[10].call(null, value, /*value*/ ctx[13], /*each_value_1*/ ctx[16], /*each_index_1*/ ctx[17]);
    	}

    	let input_props = { name: /*name*/ ctx[12] };

    	if (/*value*/ ctx[13] !== void 0) {
    		input_props.value = /*value*/ ctx[13];
    	}

    	const input = new Input({ props: input_props, $$inline: true });
    	binding_callbacks.push(() => bind(input, "value", input_value_binding_1));

    	const block = {
    		c: function create() {
    			create_component(input.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(input.$$.fragment, nodes);
    		},
    		m: function mount(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const input_changes = {};
    			if (dirty & /*userInputs*/ 1) input_changes.name = /*name*/ ctx[12];

    			if (!updating_value && dirty & /*userInputs*/ 1) {
    				updating_value = true;
    				input_changes.value = /*value*/ ctx[13];
    				add_flush_callback(() => updating_value = false);
    			}

    			input.$set(input_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(input, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(57:8) {#each userInputs as { name, value }}",
    		ctx
    	});

    	return block;
    }

    // (61:8) {#each inheritedInputs as { name, value }}
    function create_each_block$3(ctx) {
    	let updating_value;
    	let current;

    	function input_value_binding_2(value) {
    		/*input_value_binding_2*/ ctx[11].call(null, value, /*value*/ ctx[13], /*each_value*/ ctx[14], /*each_index*/ ctx[15]);
    	}

    	let input_props = { name: /*name*/ ctx[12] };

    	if (/*value*/ ctx[13] !== void 0) {
    		input_props.value = /*value*/ ctx[13];
    	}

    	const input = new Input({ props: input_props, $$inline: true });
    	binding_callbacks.push(() => bind(input, "value", input_value_binding_2));

    	const block = {
    		c: function create() {
    			create_component(input.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(input.$$.fragment, nodes);
    		},
    		m: function mount(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const input_changes = {};
    			if (dirty & /*inheritedInputs*/ 2) input_changes.name = /*name*/ ctx[12];

    			if (!updating_value && dirty & /*inheritedInputs*/ 2) {
    				updating_value = true;
    				input_changes.value = /*value*/ ctx[13];
    				add_flush_callback(() => updating_value = false);
    			}

    			input.$set(input_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(input, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(61:8) {#each inheritedInputs as { name, value }}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*meta*/ ctx[4] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			if (if_block) if_block.l(nodes);
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*meta*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*meta*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function toObj([name, value]) {
    	return { name, value };
    }

    function clone$1(obj) {
    	return JSON.parse(JSON.stringify(obj));
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $route;
    	validate_store(route, "route");
    	component_subscribe($$self, route, $$value => $$invalidate(5, $route = $$value));
    	let metaName = "";
    	let userInputs = [];
    	let inheritedInputs = [];

    	function setInputs() {
    		$$invalidate(0, userInputs = clone$1(Object.entries(ownMeta || {})).map(toObj));
    		$$invalidate(1, inheritedInputs = clone$1(Object.entries(meta || {})).filter(([inhKey]) => !userInputs.find(({ name }) => inhKey === name)).map(toObj));
    	}

    	const writable_props = [];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<File> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("File", $$slots, []);

    	function addmeta_userInputs_binding(value) {
    		userInputs = value;
    		$$invalidate(0, userInputs);
    	}

    	function input_value_binding(value) {
    		ownMeta.title = value;
    		(($$invalidate(3, ownMeta), $$invalidate(2, file)), $$invalidate(5, $route));
    	}

    	function input_value_binding_1(value$1, value, each_value_1, each_index_1) {
    		each_value_1[each_index_1].value = value$1;
    		$$invalidate(0, userInputs);
    	}

    	function input_value_binding_2(value$1, value, each_value, each_index) {
    		each_value[each_index].value = value$1;
    		$$invalidate(1, inheritedInputs);
    	}

    	$$self.$capture_state = () => ({
    		route,
    		tree,
    		routes: routes$1,
    		Input,
    		AddMeta,
    		metaName,
    		userInputs,
    		inheritedInputs,
    		setInputs,
    		toObj,
    		clone: clone$1,
    		file,
    		$route,
    		ownMeta,
    		meta
    	});

    	$$self.$inject_state = $$props => {
    		if ("metaName" in $$props) metaName = $$props.metaName;
    		if ("userInputs" in $$props) $$invalidate(0, userInputs = $$props.userInputs);
    		if ("inheritedInputs" in $$props) $$invalidate(1, inheritedInputs = $$props.inheritedInputs);
    		if ("file" in $$props) $$invalidate(2, file = $$props.file);
    		if ("ownMeta" in $$props) $$invalidate(3, ownMeta = $$props.ownMeta);
    		if ("meta" in $$props) $$invalidate(4, meta = $$props.meta);
    	};

    	let file;
    	let ownMeta;
    	let meta;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$route*/ 32) {
    			 $$invalidate(2, file = $route);
    		}

    		if ($$self.$$.dirty & /*file*/ 4) {
    			 $$invalidate(3, ownMeta = file && file.ownMeta);
    		}

    		if ($$self.$$.dirty & /*file*/ 4) {
    			 $$invalidate(4, meta = file && file.meta);
    		}

    		if ($$self.$$.dirty & /*ownMeta*/ 8) {
    			 if (ownMeta) setInputs();
    		}
    	};

    	return [
    		userInputs,
    		inheritedInputs,
    		file,
    		ownMeta,
    		meta,
    		$route,
    		metaName,
    		setInputs,
    		addmeta_userInputs_binding,
    		input_value_binding,
    		input_value_binding_1,
    		input_value_binding_2
    	];
    }

    class File$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "File",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* C:\Users\jakob\sandbox\svelte\dev\routify-helper\src\components\Header.svelte generated by Svelte v3.22.2 */
    const file$7 = "C:\\Users\\jakob\\sandbox\\svelte\\dev\\routify-helper\\src\\components\\Header.svelte";

    function create_fragment$a(ctx) {
    	let label0;
    	let input0;
    	let t0;
    	let t1;
    	let label1;
    	let input1;
    	let t2;
    	let t3;
    	let label2;
    	let input2;
    	let t4;
    	let dispose;

    	const block = {
    		c: function create() {
    			label0 = element("label");
    			input0 = element("input");
    			t0 = text("\r\n  index");
    			t1 = space();
    			label1 = element("label");
    			input1 = element("input");
    			t2 = text("\r\n  tree");
    			t3 = space();
    			label2 = element("label");
    			input2 = element("input");
    			t4 = text("\r\n  file");
    			this.h();
    		},
    		l: function claim(nodes) {
    			label0 = claim_element(nodes, "LABEL", {});
    			var label0_nodes = children(label0);
    			input0 = claim_element(label0_nodes, "INPUT", { type: true });
    			t0 = claim_text(label0_nodes, "\r\n  index");
    			label0_nodes.forEach(detach_dev);
    			t1 = claim_space(nodes);
    			label1 = claim_element(nodes, "LABEL", {});
    			var label1_nodes = children(label1);
    			input1 = claim_element(label1_nodes, "INPUT", { type: true });
    			t2 = claim_text(label1_nodes, "\r\n  tree");
    			label1_nodes.forEach(detach_dev);
    			t3 = claim_space(nodes);
    			label2 = claim_element(nodes, "LABEL", {});
    			var label2_nodes = children(label2);
    			input2 = claim_element(label2_nodes, "INPUT", { type: true });
    			t4 = claim_text(label2_nodes, "\r\n  file");
    			label2_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(input0, "type", "checkbox");
    			add_location(input0, file$7, 6, 2, 75);
    			add_location(label0, file$7, 5, 0, 64);
    			attr_dev(input1, "type", "checkbox");
    			add_location(input1, file$7, 10, 2, 166);
    			add_location(label1, file$7, 9, 0, 155);
    			attr_dev(input2, "type", "checkbox");
    			add_location(input2, file$7, 14, 2, 255);
    			add_location(label2, file$7, 13, 0, 244);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, label0, anchor);
    			append_dev(label0, input0);
    			input0.checked = /*$options*/ ctx[0].showIndex;
    			append_dev(label0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, label1, anchor);
    			append_dev(label1, input1);
    			input1.checked = /*$options*/ ctx[0].showTree;
    			append_dev(label1, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, label2, anchor);
    			append_dev(label2, input2);
    			input2.checked = /*$options*/ ctx[0].showFile;
    			append_dev(label2, t4);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input0, "change", /*input0_change_handler*/ ctx[1]),
    				listen_dev(input1, "change", /*input1_change_handler*/ ctx[2]),
    				listen_dev(input2, "change", /*input2_change_handler*/ ctx[3])
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$options*/ 1) {
    				input0.checked = /*$options*/ ctx[0].showIndex;
    			}

    			if (dirty & /*$options*/ 1) {
    				input1.checked = /*$options*/ ctx[0].showTree;
    			}

    			if (dirty & /*$options*/ 1) {
    				input2.checked = /*$options*/ ctx[0].showFile;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(label1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(label2);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $options;
    	validate_store(options, "options");
    	component_subscribe($$self, options, $$value => $$invalidate(0, $options = $$value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Header", $$slots, []);

    	function input0_change_handler() {
    		$options.showIndex = this.checked;
    		options.set($options);
    	}

    	function input1_change_handler() {
    		$options.showTree = this.checked;
    		options.set($options);
    	}

    	function input2_change_handler() {
    		$options.showFile = this.checked;
    		options.set($options);
    	}

    	$$self.$capture_state = () => ({ options, $options });
    	return [$options, input0_change_handler, input1_change_handler, input2_change_handler];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    const s$1 = document.createElement("style");
    s$1.textContent = getStylesheet();
    document.head.append(s$1);

    function getStylesheet() {
      return `
  #__routify-helper html {
    line-height: 1.15;
    /* 1 */
    -webkit-text-size-adjust: 100%;
    /* 2 */
  }
  #__routify-helper body {
    margin: 0;
  }
  #__routify-helper main {
    display: block;
  }
  #__routify-helper h1 {
    font-size: 2em;
    margin: 0.67em 0;
  }
  #__routify-helper hr {
    box-sizing: content-box;
    /* 1 */
    height: 0;
    /* 1 */
    overflow: visible;
    /* 2 */
  }
  #__routify-helper pre {
    font-family: monospace, monospace;
    /* 1 */
    font-size: 1em;
    /* 2 */
  }
  #__routify-helper a {
    background-color: transparent;
  }
  #__routify-helper abbr[title] {
    border-bottom: none;
    /* 1 */
    text-decoration: underline;
    /* 2 */
    text-decoration: underline dotted;
    /* 2 */
  }
  #__routify-helper b,
  #__routify-helper strong {
    font-weight: bolder;
  }
  #__routify-helper code,
  #__routify-helper kbd,
  #__routify-helper samp {
    font-family: monospace, monospace;
    /* 1 */
    font-size: 1em;
    /* 2 */
  }
  #__routify-helper small {
    font-size: 80%;
  }
  #__routify-helper sub,
  #__routify-helper sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }
  #__routify-helper sub {
    bottom: -0.25em;
  }
  #__routify-helper sup {
    top: -0.5em;
  }
  #__routify-helper img {
    border-style: none;
  }
  #__routify-helper button,
  #__routify-helper input,
  #__routify-helper optgroup,
  #__routify-helper select,
  #__routify-helper textarea {
    font-family: inherit;
    /* 1 */
    font-size: 100%;
    /* 1 */
    line-height: 1.15;
    /* 1 */
    margin: 0;
    /* 2 */
  }
  #__routify-helper button,
  #__routify-helper input {
    /* 1 */
    overflow: visible;
  }
  #__routify-helper button,
  #__routify-helper select {
    /* 1 */
    text-transform: none;
  }
  #__routify-helper button,
  #__routify-helper [type=button],
  #__routify-helper [type=reset],
  #__routify-helper [type=submit] {
    -webkit-appearance: button;
  }
  #__routify-helper button::-moz-focus-inner,
  #__routify-helper [type=button]::-moz-focus-inner,
  #__routify-helper [type=reset]::-moz-focus-inner,
  #__routify-helper [type=submit]::-moz-focus-inner {
    border-style: none;
    padding: 0;
  }
  #__routify-helper button:-moz-focusring,
  #__routify-helper [type=button]:-moz-focusring,
  #__routify-helper [type=reset]:-moz-focusring,
  #__routify-helper [type=submit]:-moz-focusring {
    outline: 1px dotted ButtonText;
  }
  #__routify-helper fieldset {
    padding: 0.35em 0.75em 0.625em;
  }
  #__routify-helper legend {
    box-sizing: border-box;
    /* 1 */
    color: inherit;
    /* 2 */
    display: table;
    /* 1 */
    max-width: 100%;
    /* 1 */
    padding: 0;
    /* 3 */
    white-space: normal;
    /* 1 */
  }
  #__routify-helper progress {
    vertical-align: baseline;
  }
  #__routify-helper textarea {
    overflow: auto;
  }
  #__routify-helper [type=checkbox],
  #__routify-helper [type=radio] {
    box-sizing: border-box;
    /* 1 */
    padding: 0;
    /* 2 */
  }
  #__routify-helper [type=number]::-webkit-inner-spin-button,
  #__routify-helper [type=number]::-webkit-outer-spin-button {
    height: auto;
  }
  #__routify-helper [type=search] {
    -webkit-appearance: textfield;
    /* 1 */
    outline-offset: -2px;
    /* 2 */
  }
  #__routify-helper [type=search]::-webkit-search-decoration {
    -webkit-appearance: none;
  }
  #__routify-helper ::-webkit-file-upload-button {
    -webkit-appearance: button;
    /* 1 */
    font: inherit;
    /* 2 */
  }
  #__routify-helper details {
    display: block;
  }
  #__routify-helper summary {
    display: list-item;
  }
  #__routify-helper template {
    display: none;
  }
  #__routify-helper [hidden] {
    display: none;
  }
  `;
    }

    /* C:\Users\jakob\sandbox\svelte\dev\routify-helper\src\components\logo.svelte generated by Svelte v3.22.2 */

    const file$8 = "C:\\Users\\jakob\\sandbox\\svelte\\dev\\routify-helper\\src\\components\\logo.svelte";

    function create_fragment$b(ctx) {
    	let svg;
    	let defs;
    	let clipPath;
    	let rect;
    	let g;
    	let linearGradient0;
    	let stop0;
    	let stop1;
    	let path0;
    	let linearGradient1;
    	let stop2;
    	let stop3;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			defs = svg_element("defs");
    			clipPath = svg_element("clipPath");
    			rect = svg_element("rect");
    			g = svg_element("g");
    			linearGradient0 = svg_element("linearGradient");
    			stop0 = svg_element("stop");
    			stop1 = svg_element("stop");
    			path0 = svg_element("path");
    			linearGradient1 = svg_element("linearGradient");
    			stop2 = svg_element("stop");
    			stop3 = svg_element("stop");
    			path1 = svg_element("path");
    			this.h();
    		},
    		l: function claim(nodes) {
    			svg = claim_element(
    				nodes,
    				"svg",
    				{
    					xmlns: true,
    					"xmlns:xlink": true,
    					style: true,
    					viewBox: true,
    					width: true,
    					height: true
    				},
    				1
    			);

    			var svg_nodes = children(svg);
    			defs = claim_element(svg_nodes, "defs", {}, 1);
    			var defs_nodes = children(defs);
    			clipPath = claim_element(defs_nodes, "clipPath", { id: true }, 1);
    			var clipPath_nodes = children(clipPath);
    			rect = claim_element(clipPath_nodes, "rect", { width: true, height: true }, 1);
    			children(rect).forEach(detach_dev);
    			clipPath_nodes.forEach(detach_dev);
    			defs_nodes.forEach(detach_dev);
    			g = claim_element(svg_nodes, "g", { "clip-path": true }, 1);
    			var g_nodes = children(g);

    			linearGradient0 = claim_element(
    				g_nodes,
    				"linearGradient",
    				{
    					id: true,
    					x1: true,
    					y1: true,
    					x2: true,
    					y2: true,
    					gradientTransform: true,
    					gradientUnits: true
    				},
    				1
    			);

    			var linearGradient0_nodes = children(linearGradient0);

    			stop0 = claim_element(
    				linearGradient0_nodes,
    				"stop",
    				{
    					offset: true,
    					"stop-opacity": true,
    					style: true
    				},
    				1
    			);

    			children(stop0).forEach(detach_dev);

    			stop1 = claim_element(
    				linearGradient0_nodes,
    				"stop",
    				{
    					offset: true,
    					"stop-opacity": true,
    					style: true
    				},
    				1
    			);

    			children(stop1).forEach(detach_dev);
    			linearGradient0_nodes.forEach(detach_dev);
    			path0 = claim_element(g_nodes, "path", { d: true, fill: true }, 1);
    			children(path0).forEach(detach_dev);

    			linearGradient1 = claim_element(
    				g_nodes,
    				"linearGradient",
    				{
    					id: true,
    					x1: true,
    					y1: true,
    					x2: true,
    					y2: true,
    					gradientTransform: true,
    					gradientUnits: true
    				},
    				1
    			);

    			var linearGradient1_nodes = children(linearGradient1);

    			stop2 = claim_element(
    				linearGradient1_nodes,
    				"stop",
    				{
    					offset: true,
    					"stop-opacity": true,
    					style: true
    				},
    				1
    			);

    			children(stop2).forEach(detach_dev);

    			stop3 = claim_element(
    				linearGradient1_nodes,
    				"stop",
    				{
    					offset: true,
    					"stop-opacity": true,
    					style: true
    				},
    				1
    			);

    			children(stop3).forEach(detach_dev);
    			linearGradient1_nodes.forEach(detach_dev);
    			path1 = claim_element(g_nodes, "path", { d: true, fill: true }, 1);
    			children(path1).forEach(detach_dev);
    			g_nodes.forEach(detach_dev);
    			svg_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(rect, "width", "1000");
    			attr_dev(rect, "height", "1000");
    			add_location(rect, file$8, 9, 12, 352);
    			attr_dev(clipPath, "id", "_clipPath_dWZOaLxWThweJRFapPkZLw56WEmth5Xh");
    			add_location(clipPath, file$8, 8, 10, 280);
    			add_location(defs, file$8, 7, 8, 262);
    			attr_dev(stop0, "offset", "1.7391304347826086%");
    			attr_dev(stop0, "stop-opacity", "1");
    			set_style(stop0, "stop-color", "rgb(255,124,247)");
    			add_location(stop0, file$8, 21, 12, 841);
    			attr_dev(stop1, "offset", "100%");
    			attr_dev(stop1, "stop-opacity", "1");
    			set_style(stop1, "stop-color", "rgb(255,203,252)");
    			add_location(stop1, file$8, 25, 12, 990);
    			attr_dev(linearGradient0, "id", "_lgradient_0");
    			attr_dev(linearGradient0, "x1", "-0.011142038971568513");
    			attr_dev(linearGradient0, "y1", "-0.011791871475954507");
    			attr_dev(linearGradient0, "x2", "0.9938039543302696");
    			attr_dev(linearGradient0, "y2", "0.9909604299907665");
    			attr_dev(linearGradient0, "gradientTransform", "matrix(532,0,0,368.749,249,625.251)");
    			attr_dev(linearGradient0, "gradientUnits", "userSpaceOnUse");
    			add_location(linearGradient0, file$8, 13, 10, 513);
    			attr_dev(path0, "d", " M 564.251 625.251 L 659 720 L 700 675 L 781 994 L 457 921 L 506\r\n            873 L 249 626 L 249 626 L 542.5 626 C 549.812 626 557.065 625.748\r\n            564.251 625.251 Z ");
    			attr_dev(path0, "fill", "url(#_lgradient_0)");
    			add_location(path0, file$8, 30, 10, 1151);
    			attr_dev(stop2, "offset", "2.1739130434782608%");
    			attr_dev(stop2, "stop-opacity", "1");
    			set_style(stop2, "stop-color", "rgb(241,93,232)");
    			add_location(stop2, file$8, 43, 12, 1716);
    			attr_dev(stop3, "offset", "100%");
    			attr_dev(stop3, "stop-opacity", "1");
    			set_style(stop3, "stop-color", "rgb(184,58,177)");
    			add_location(stop3, file$8, 47, 12, 1864);
    			attr_dev(linearGradient1, "id", "_lgradient_1");
    			attr_dev(linearGradient1, "x1", "0.13056277056277052");
    			attr_dev(linearGradient1, "y1", "0.05232744783306609");
    			attr_dev(linearGradient1, "x2", "0.9350649350649348");
    			attr_dev(linearGradient1, "y2", "0.7710005350454795");
    			attr_dev(linearGradient1, "gradientTransform", "matrix(770,0,0,623,84,3)");
    			attr_dev(linearGradient1, "gradientUnits", "userSpaceOnUse");
    			add_location(linearGradient1, file$8, 35, 10, 1403);
    			attr_dev(path1, "d", " M 542.5 215.388 L 84 215.388 L 203 3 L 542.5 3 L 542.5 3 C\r\n            714.422 3 854 142.578 854 314.5 C 854 486.422 714.422 626 542.5 626\r\n            L 249 626 L 364 413.612 L 542.5 413.612 L 542.5 413.612 C 597.201\r\n            413.612 641.612 369.201 641.612 314.5 C 641.612 259.799 597.201\r\n            215.388 542.5 215.388 L 542.5 215.388 L 542.5 215.388 Z ");
    			attr_dev(path1, "fill", "url(#_lgradient_1)");
    			add_location(path1, file$8, 52, 10, 2024);
    			attr_dev(g, "clip-path", "url(#_clipPath_dWZOaLxWThweJRFapPkZLw56WEmth5Xh)");
    			add_location(g, file$8, 12, 8, 437);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			set_style(svg, "isolation", "isolate");
    			set_style(svg, "width", "32px");
    			set_style(svg, "height", "32px");
    			attr_dev(svg, "viewBox", "0 0 1000 1000");
    			attr_dev(svg, "width", "1000pt");
    			attr_dev(svg, "height", "1000pt");
    			add_location(svg, file$8, 0, 6, 6);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, defs);
    			append_dev(defs, clipPath);
    			append_dev(clipPath, rect);
    			append_dev(svg, g);
    			append_dev(g, linearGradient0);
    			append_dev(linearGradient0, stop0);
    			append_dev(linearGradient0, stop1);
    			append_dev(g, path0);
    			append_dev(g, linearGradient1);
    			append_dev(linearGradient1, stop2);
    			append_dev(linearGradient1, stop3);
    			append_dev(g, path1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Logo> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Logo", $$slots, []);
    	return [];
    }

    class Logo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Logo",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* C:\Users\jakob\sandbox\svelte\dev\routify-helper\src\Helper.svelte generated by Svelte v3.22.2 */
    const file$9 = "C:\\Users\\jakob\\sandbox\\svelte\\dev\\routify-helper\\src\\Helper.svelte";

    // (48:0) {#if $route}
    function create_if_block$7(ctx) {
    	let div1;
    	let div0;
    	let t;
    	let current;
    	let dispose;
    	const logo = new Logo({ $$inline: true });
    	let if_block = /*$options*/ ctx[0].showHelper && create_if_block_1$3(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(logo.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			this.h();
    		},
    		l: function claim(nodes) {
    			div1 = claim_element(nodes, "DIV", { class: true, id: true });
    			var div1_nodes = children(div1);
    			div0 = claim_element(div1_nodes, "DIV", { class: true });
    			var div0_nodes = children(div0);
    			claim_component(logo.$$.fragment, div0_nodes);
    			div0_nodes.forEach(detach_dev);
    			t = claim_space(div1_nodes);
    			if (if_block) if_block.l(div1_nodes);
    			div1_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(div0, "class", "svelte-46oflk");
    			add_location(div0, file$9, 49, 4, 1106);
    			attr_dev(div1, "class", "routify svelte-46oflk");
    			attr_dev(div1, "id", "__routify-helper");
    			add_location(div1, file$9, 48, 2, 1057);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(logo, div0, null);
    			append_dev(div1, t);
    			if (if_block) if_block.m(div1, null);
    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(div0, "click", /*click_handler*/ ctx[6], false, false, false);
    		},
    		p: function update(ctx, dirty) {
    			if (/*$options*/ ctx[0].showHelper) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$options*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(logo.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(logo.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(logo);
    			if (if_block) if_block.d();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(48:0) {#if $route}",
    		ctx
    	});

    	return block;
    }

    // (54:4) {#if $options.showHelper}
    function create_if_block_1$3(ctx) {
    	let div3;
    	let div0;
    	let t0;
    	let div2;
    	let div1;
    	let t1;
    	let current;
    	const header = new Header({ $$inline: true });

    	const tree_1 = new Tree({
    			props: { tree: /*$treeStore*/ ctx[2] },
    			$$inline: true
    		});

    	let if_block = /*$options*/ ctx[0].showFile && create_if_block_2$1(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			create_component(header.$$.fragment);
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			create_component(tree_1.$$.fragment);
    			t1 = space();
    			if (if_block) if_block.c();
    			this.h();
    		},
    		l: function claim(nodes) {
    			div3 = claim_element(nodes, "DIV", { class: true });
    			var div3_nodes = children(div3);
    			div0 = claim_element(div3_nodes, "DIV", { style: true, class: true });
    			var div0_nodes = children(div0);
    			claim_component(header.$$.fragment, div0_nodes);
    			div0_nodes.forEach(detach_dev);
    			t0 = claim_space(div3_nodes);
    			div2 = claim_element(div3_nodes, "DIV", { class: true });
    			var div2_nodes = children(div2);
    			div1 = claim_element(div2_nodes, "DIV", { class: true });
    			var div1_nodes = children(div1);
    			claim_component(tree_1.$$.fragment, div1_nodes);
    			div1_nodes.forEach(detach_dev);
    			t1 = claim_space(div2_nodes);
    			if (if_block) if_block.l(div2_nodes);
    			div2_nodes.forEach(detach_dev);
    			div3_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			set_style(div0, "width", "100%");
    			set_style(div0, "display", "flex");
    			attr_dev(div0, "class", "svelte-46oflk");
    			add_location(div0, file$9, 55, 8, 1273);
    			attr_dev(div1, "class", "tree svelte-46oflk");
    			add_location(div1, file$9, 59, 10, 1392);
    			attr_dev(div2, "class", "main svelte-46oflk");
    			add_location(div2, file$9, 58, 8, 1362);
    			attr_dev(div3, "class", "content svelte-46oflk");
    			add_location(div3, file$9, 54, 6, 1242);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			mount_component(header, div0, null);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			mount_component(tree_1, div1, null);
    			append_dev(div2, t1);
    			if (if_block) if_block.m(div2, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tree_1_changes = {};
    			if (dirty & /*$treeStore*/ 4) tree_1_changes.tree = /*$treeStore*/ ctx[2];
    			tree_1.$set(tree_1_changes);

    			if (/*$options*/ ctx[0].showFile) {
    				if (if_block) {
    					if (dirty & /*$options*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div2, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(tree_1.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(tree_1.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(header);
    			destroy_component(tree_1);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(54:4) {#if $options.showHelper}",
    		ctx
    	});

    	return block;
    }

    // (63:10) {#if $options.showFile}
    function create_if_block_2$1(ctx) {
    	let div;
    	let current;
    	const file_1 = new File$1({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(file_1.$$.fragment);
    			this.h();
    		},
    		l: function claim(nodes) {
    			div = claim_element(nodes, "DIV", { class: true });
    			var div_nodes = children(div);
    			claim_component(file_1.$$.fragment, div_nodes);
    			div_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(div, "class", "file svelte-46oflk");
    			add_location(div, file$9, 63, 12, 1517);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(file_1, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(file_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(file_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(file_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(63:10) {#if $options.showFile}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$route*/ ctx[1] && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			if (if_block) if_block.l(nodes);
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$route*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$route*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $options;
    	let $route;
    	let $treeStore;
    	validate_store(options, "options");
    	component_subscribe($$self, options, $$value => $$invalidate(0, $options = $$value));
    	validate_store(route, "route");
    	component_subscribe($$self, route, $$value => $$invalidate(1, $route = $$value));
    	let { tree } = $$props, { port } = $$props;
    	set_store_value(options, $options.port = port, $options);
    	const treeStore = writable(tree);
    	validate_store(treeStore, "treeStore");
    	component_subscribe($$self, treeStore, value => $$invalidate(2, $treeStore = value));
    	setContext("treeStore", treeStore);
    	const writable_props = ["tree", "port"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Helper> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Helper", $$slots, []);
    	const click_handler = () => set_store_value(options, $options.showHelper = !$options.showHelper, $options);

    	$$self.$set = $$props => {
    		if ("tree" in $$props) $$invalidate(4, tree = $$props.tree);
    		if ("port" in $$props) $$invalidate(5, port = $$props.port);
    	};

    	$$self.$capture_state = () => ({
    		writable,
    		setContext,
    		route,
    		options,
    		Tree,
    		File: File$1,
    		Header,
    		Logo,
    		tree,
    		port,
    		treeStore,
    		$options,
    		$route,
    		$treeStore
    	});

    	$$self.$inject_state = $$props => {
    		if ("tree" in $$props) $$invalidate(4, tree = $$props.tree);
    		if ("port" in $$props) $$invalidate(5, port = $$props.port);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$options, $route, $treeStore, treeStore, tree, port, click_handler];
    }

    class Helper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { tree: 4, port: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Helper",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*tree*/ ctx[4] === undefined && !("tree" in props)) {
    			console.warn("<Helper> was created without expected prop 'tree'");
    		}

    		if (/*port*/ ctx[5] === undefined && !("port" in props)) {
    			console.warn("<Helper> was created without expected prop 'port'");
    		}
    	}

    	get tree() {
    		throw new Error("<Helper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tree(value) {
    		throw new Error("<Helper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get port() {
    		throw new Error("<Helper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set port(value) {
    		throw new Error("<Helper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    //tree
    const _tree = {
      "name": "root",
      "filepath": "/",
      "root": true,
      "ownMeta": {},
      "children": [
        {
          "isFile": false,
          "isDir": true,
          "file": "fetch",
          "filepath": "/fetch",
          "name": "fetch",
          "ext": "",
          "badExt": false,
          "absolutePath": "C:/Users/jakob/sandbox/svelte/dev/svelte-filerouter/example2/src/pages/fetch",
          "children": [
            {
              "isFile": false,
              "isDir": true,
              "file": "batch",
              "filepath": "/fetch/batch",
              "name": "batch",
              "ext": "",
              "badExt": false,
              "absolutePath": "C:/Users/jakob/sandbox/svelte/dev/svelte-filerouter/example2/src/pages/fetch/batch",
              "children": [
                {
                  "isFile": true,
                  "isDir": false,
                  "file": "index.svelte",
                  "filepath": "/fetch/batch/index.svelte",
                  "name": "index",
                  "ext": "svelte",
                  "badExt": false,
                  "absolutePath": "C:/Users/jakob/sandbox/svelte/dev/svelte-filerouter/example2/src/pages/fetch/batch/index.svelte",
                  "isLayout": false,
                  "isReset": false,
                  "isIndex": true,
                  "isFallback": false,
                  "isPage": true,
                  "ownMeta": {},
                  "meta": {
                    "preload": false,
                    "prerender": true,
                    "precache-order": false,
                    "precache-proximity": true,
                    "recursive": true
                  },
                  "path": "/fetch/batch/index",
                  "id": "_fetch_batch_index",
                  "component": () => Promise.resolve().then(function () { return index; }).then(m => m.default)
                },
                {
                  "isFile": true,
                  "isDir": false,
                  "file": "page0.svelte",
                  "filepath": "/fetch/batch/page0.svelte",
                  "name": "page0",
                  "ext": "svelte",
                  "badExt": false,
                  "absolutePath": "C:/Users/jakob/sandbox/svelte/dev/svelte-filerouter/example2/src/pages/fetch/batch/page0.svelte",
                  "isLayout": false,
                  "isReset": false,
                  "isIndex": false,
                  "isFallback": false,
                  "isPage": true,
                  "ownMeta": {},
                  "meta": {
                    "preload": false,
                    "prerender": true,
                    "precache-order": false,
                    "precache-proximity": true,
                    "recursive": true
                  },
                  "path": "/fetch/batch/page0",
                  "id": "_fetch_batch_page0",
                  "component": () => Promise.resolve().then(function () { return page0; }).then(m => m.default)
                },
                {
                  "isFile": true,
                  "isDir": false,
                  "file": "page1.svelte",
                  "filepath": "/fetch/batch/page1.svelte",
                  "name": "page1",
                  "ext": "svelte",
                  "badExt": false,
                  "absolutePath": "C:/Users/jakob/sandbox/svelte/dev/svelte-filerouter/example2/src/pages/fetch/batch/page1.svelte",
                  "isLayout": false,
                  "isReset": false,
                  "isIndex": false,
                  "isFallback": false,
                  "isPage": true,
                  "ownMeta": {},
                  "meta": {
                    "preload": false,
                    "prerender": true,
                    "precache-order": false,
                    "precache-proximity": true,
                    "recursive": true
                  },
                  "path": "/fetch/batch/page1",
                  "id": "_fetch_batch_page1",
                  "component": () => Promise.resolve().then(function () { return page1; }).then(m => m.default)
                },
                {
                  "isFile": true,
                  "isDir": false,
                  "file": "page2.svelte",
                  "filepath": "/fetch/batch/page2.svelte",
                  "name": "page2",
                  "ext": "svelte",
                  "badExt": false,
                  "absolutePath": "C:/Users/jakob/sandbox/svelte/dev/svelte-filerouter/example2/src/pages/fetch/batch/page2.svelte",
                  "isLayout": false,
                  "isReset": false,
                  "isIndex": false,
                  "isFallback": false,
                  "isPage": true,
                  "ownMeta": {},
                  "meta": {
                    "preload": false,
                    "prerender": true,
                    "precache-order": false,
                    "precache-proximity": true,
                    "recursive": true
                  },
                  "path": "/fetch/batch/page2",
                  "id": "_fetch_batch_page2",
                  "component": () => Promise.resolve().then(function () { return page2; }).then(m => m.default)
                },
                {
                  "isFile": true,
                  "isDir": false,
                  "file": "page3.svelte",
                  "filepath": "/fetch/batch/page3.svelte",
                  "name": "page3",
                  "ext": "svelte",
                  "badExt": false,
                  "absolutePath": "C:/Users/jakob/sandbox/svelte/dev/svelte-filerouter/example2/src/pages/fetch/batch/page3.svelte",
                  "isLayout": false,
                  "isReset": false,
                  "isIndex": false,
                  "isFallback": false,
                  "isPage": true,
                  "ownMeta": {},
                  "meta": {
                    "preload": false,
                    "prerender": true,
                    "precache-order": false,
                    "precache-proximity": true,
                    "recursive": true
                  },
                  "path": "/fetch/batch/page3",
                  "id": "_fetch_batch_page3",
                  "component": () => Promise.resolve().then(function () { return page3; }).then(m => m.default)
                },
                {
                  "isFile": true,
                  "isDir": false,
                  "file": "page4.svelte",
                  "filepath": "/fetch/batch/page4.svelte",
                  "name": "page4",
                  "ext": "svelte",
                  "badExt": false,
                  "absolutePath": "C:/Users/jakob/sandbox/svelte/dev/svelte-filerouter/example2/src/pages/fetch/batch/page4.svelte",
                  "isLayout": false,
                  "isReset": false,
                  "isIndex": false,
                  "isFallback": false,
                  "isPage": true,
                  "ownMeta": {},
                  "meta": {
                    "preload": false,
                    "prerender": true,
                    "precache-order": false,
                    "precache-proximity": true,
                    "recursive": true
                  },
                  "path": "/fetch/batch/page4",
                  "id": "_fetch_batch_page4",
                  "component": () => Promise.resolve().then(function () { return page4; }).then(m => m.default)
                },
                {
                  "isFile": true,
                  "isDir": false,
                  "file": "page5.svelte",
                  "filepath": "/fetch/batch/page5.svelte",
                  "name": "page5",
                  "ext": "svelte",
                  "badExt": false,
                  "absolutePath": "C:/Users/jakob/sandbox/svelte/dev/svelte-filerouter/example2/src/pages/fetch/batch/page5.svelte",
                  "isLayout": false,
                  "isReset": false,
                  "isIndex": false,
                  "isFallback": false,
                  "isPage": true,
                  "ownMeta": {},
                  "meta": {
                    "preload": false,
                    "prerender": true,
                    "precache-order": false,
                    "precache-proximity": true,
                    "recursive": true
                  },
                  "path": "/fetch/batch/page5",
                  "id": "_fetch_batch_page5",
                  "component": () => Promise.resolve().then(function () { return page5; }).then(m => m.default)
                },
                {
                  "isFile": true,
                  "isDir": false,
                  "file": "page6.svelte",
                  "filepath": "/fetch/batch/page6.svelte",
                  "name": "page6",
                  "ext": "svelte",
                  "badExt": false,
                  "absolutePath": "C:/Users/jakob/sandbox/svelte/dev/svelte-filerouter/example2/src/pages/fetch/batch/page6.svelte",
                  "isLayout": false,
                  "isReset": false,
                  "isIndex": false,
                  "isFallback": false,
                  "isPage": true,
                  "ownMeta": {},
                  "meta": {
                    "preload": false,
                    "prerender": true,
                    "precache-order": false,
                    "precache-proximity": true,
                    "recursive": true
                  },
                  "path": "/fetch/batch/page6",
                  "id": "_fetch_batch_page6",
                  "component": () => Promise.resolve().then(function () { return page6; }).then(m => m.default)
                },
                {
                  "isFile": true,
                  "isDir": false,
                  "file": "page7.svelte",
                  "filepath": "/fetch/batch/page7.svelte",
                  "name": "page7",
                  "ext": "svelte",
                  "badExt": false,
                  "absolutePath": "C:/Users/jakob/sandbox/svelte/dev/svelte-filerouter/example2/src/pages/fetch/batch/page7.svelte",
                  "isLayout": false,
                  "isReset": false,
                  "isIndex": false,
                  "isFallback": false,
                  "isPage": true,
                  "ownMeta": {},
                  "meta": {
                    "preload": false,
                    "prerender": true,
                    "precache-order": false,
                    "precache-proximity": true,
                    "recursive": true
                  },
                  "path": "/fetch/batch/page7",
                  "id": "_fetch_batch_page7",
                  "component": () => Promise.resolve().then(function () { return page7; }).then(m => m.default)
                },
                {
                  "isFile": true,
                  "isDir": false,
                  "file": "page8.svelte",
                  "filepath": "/fetch/batch/page8.svelte",
                  "name": "page8",
                  "ext": "svelte",
                  "badExt": false,
                  "absolutePath": "C:/Users/jakob/sandbox/svelte/dev/svelte-filerouter/example2/src/pages/fetch/batch/page8.svelte",
                  "isLayout": false,
                  "isReset": false,
                  "isIndex": false,
                  "isFallback": false,
                  "isPage": true,
                  "ownMeta": {},
                  "meta": {
                    "preload": false,
                    "prerender": true,
                    "precache-order": false,
                    "precache-proximity": true,
                    "recursive": true
                  },
                  "path": "/fetch/batch/page8",
                  "id": "_fetch_batch_page8",
                  "component": () => Promise.resolve().then(function () { return page8; }).then(m => m.default)
                },
                {
                  "isFile": true,
                  "isDir": false,
                  "file": "page9.svelte",
                  "filepath": "/fetch/batch/page9.svelte",
                  "name": "page9",
                  "ext": "svelte",
                  "badExt": false,
                  "absolutePath": "C:/Users/jakob/sandbox/svelte/dev/svelte-filerouter/example2/src/pages/fetch/batch/page9.svelte",
                  "isLayout": false,
                  "isReset": false,
                  "isIndex": false,
                  "isFallback": false,
                  "isPage": true,
                  "ownMeta": {},
                  "meta": {
                    "preload": false,
                    "prerender": true,
                    "precache-order": false,
                    "precache-proximity": true,
                    "recursive": true
                  },
                  "path": "/fetch/batch/page9",
                  "id": "_fetch_batch_page9",
                  "component": () => Promise.resolve().then(function () { return page9; }).then(m => m.default)
                },
                {
                  "isFile": true,
                  "isDir": false,
                  "file": "_layout.svelte",
                  "filepath": "/fetch/batch/_layout.svelte",
                  "name": "_layout",
                  "ext": "svelte",
                  "badExt": false,
                  "absolutePath": "C:/Users/jakob/sandbox/svelte/dev/svelte-filerouter/example2/src/pages/fetch/batch/_layout.svelte",
                  "isLayout": true,
                  "isReset": false,
                  "isIndex": false,
                  "isFallback": false,
                  "isPage": false,
                  "ownMeta": {},
                  "meta": {
                    "preload": false,
                    "prerender": true,
                    "precache-order": false,
                    "precache-proximity": true,
                    "recursive": true
                  },
                  "path": "/fetch/batch",
                  "id": "_fetch_batch__layout",
                  "component": () => Promise.resolve().then(function () { return _layout; }).then(m => m.default)
                }
              ],
              "isLayout": false,
              "isReset": false,
              "isIndex": false,
              "isFallback": false,
              "isPage": false,
              "ownMeta": {},
              "meta": {
                "preload": false,
                "prerender": true,
                "precache-order": false,
                "precache-proximity": true,
                "recursive": true
              },
              "path": "/fetch/batch"
            },
            {
              "isFile": true,
              "isDir": false,
              "file": "index.svelte",
              "filepath": "/fetch/index.svelte",
              "name": "index",
              "ext": "svelte",
              "badExt": false,
              "absolutePath": "C:/Users/jakob/sandbox/svelte/dev/svelte-filerouter/example2/src/pages/fetch/index.svelte",
              "isLayout": false,
              "isReset": false,
              "isIndex": true,
              "isFallback": false,
              "isPage": true,
              "ownMeta": {},
              "meta": {
                "preload": false,
                "prerender": true,
                "precache-order": false,
                "precache-proximity": true,
                "recursive": true
              },
              "path": "/fetch/index",
              "id": "_fetch_index",
              "component": () => Promise.resolve().then(function () { return index$1; }).then(m => m.default)
            },
            {
              "isFile": false,
              "isDir": true,
              "file": "prefetch",
              "filepath": "/fetch/prefetch",
              "name": "prefetch",
              "ext": "",
              "badExt": false,
              "absolutePath": "C:/Users/jakob/sandbox/svelte/dev/svelte-filerouter/example2/src/pages/fetch/prefetch",
              "children": [
                {
                  "isFile": true,
                  "isDir": false,
                  "file": "delay0.svelte",
                  "filepath": "/fetch/prefetch/delay0.svelte",
                  "name": "delay0",
                  "ext": "svelte",
                  "badExt": false,
                  "absolutePath": "C:/Users/jakob/sandbox/svelte/dev/svelte-filerouter/example2/src/pages/fetch/prefetch/delay0.svelte",
                  "isLayout": false,
                  "isReset": false,
                  "isIndex": false,
                  "isFallback": false,
                  "isPage": true,
                  "ownMeta": {},
                  "meta": {
                    "preload": false,
                    "prerender": true,
                    "precache-order": false,
                    "precache-proximity": true,
                    "recursive": true
                  },
                  "path": "/fetch/prefetch/delay0",
                  "id": "_fetch_prefetch_delay0",
                  "component": () => Promise.resolve().then(function () { return delay0; }).then(m => m.default)
                },
                {
                  "isFile": true,
                  "isDir": false,
                  "file": "delay1.svelte",
                  "filepath": "/fetch/prefetch/delay1.svelte",
                  "name": "delay1",
                  "ext": "svelte",
                  "badExt": false,
                  "absolutePath": "C:/Users/jakob/sandbox/svelte/dev/svelte-filerouter/example2/src/pages/fetch/prefetch/delay1.svelte",
                  "isLayout": false,
                  "isReset": false,
                  "isIndex": false,
                  "isFallback": false,
                  "isPage": true,
                  "ownMeta": {},
                  "meta": {
                    "preload": false,
                    "prerender": true,
                    "precache-order": false,
                    "precache-proximity": true,
                    "recursive": true
                  },
                  "path": "/fetch/prefetch/delay1",
                  "id": "_fetch_prefetch_delay1",
                  "component": () => Promise.resolve().then(function () { return delay1; }).then(m => m.default)
                },
                {
                  "isFile": true,
                  "isDir": false,
                  "file": "delay2.svelte",
                  "filepath": "/fetch/prefetch/delay2.svelte",
                  "name": "delay2",
                  "ext": "svelte",
                  "badExt": false,
                  "absolutePath": "C:/Users/jakob/sandbox/svelte/dev/svelte-filerouter/example2/src/pages/fetch/prefetch/delay2.svelte",
                  "isLayout": false,
                  "isReset": false,
                  "isIndex": false,
                  "isFallback": false,
                  "isPage": true,
                  "ownMeta": {},
                  "meta": {
                    "preload": false,
                    "prerender": true,
                    "precache-order": false,
                    "precache-proximity": true,
                    "recursive": true
                  },
                  "path": "/fetch/prefetch/delay2",
                  "id": "_fetch_prefetch_delay2",
                  "component": () => Promise.resolve().then(function () { return delay2; }).then(m => m.default)
                },
                {
                  "isFile": true,
                  "isDir": false,
                  "file": "index.svelte",
                  "filepath": "/fetch/prefetch/index.svelte",
                  "name": "index",
                  "ext": "svelte",
                  "badExt": false,
                  "absolutePath": "C:/Users/jakob/sandbox/svelte/dev/svelte-filerouter/example2/src/pages/fetch/prefetch/index.svelte",
                  "isLayout": false,
                  "isReset": false,
                  "isIndex": true,
                  "isFallback": false,
                  "isPage": true,
                  "ownMeta": {
                    "index": false
                  },
                  "meta": {
                    "index": false,
                    "preload": false,
                    "prerender": true,
                    "precache-order": false,
                    "precache-proximity": true,
                    "recursive": true
                  },
                  "path": "/fetch/prefetch/index",
                  "id": "_fetch_prefetch_index",
                  "component": () => Promise.resolve().then(function () { return index$2; }).then(m => m.default)
                },
                {
                  "isFile": true,
                  "isDir": false,
                  "file": "_layout.svelte",
                  "filepath": "/fetch/prefetch/_layout.svelte",
                  "name": "_layout",
                  "ext": "svelte",
                  "badExt": false,
                  "absolutePath": "C:/Users/jakob/sandbox/svelte/dev/svelte-filerouter/example2/src/pages/fetch/prefetch/_layout.svelte",
                  "isLayout": true,
                  "isReset": false,
                  "isIndex": false,
                  "isFallback": false,
                  "isPage": false,
                  "ownMeta": {},
                  "meta": {
                    "preload": false,
                    "prerender": true,
                    "precache-order": false,
                    "precache-proximity": true,
                    "recursive": true
                  },
                  "path": "/fetch/prefetch",
                  "id": "_fetch_prefetch__layout",
                  "component": () => Promise.resolve().then(function () { return _layout$1; }).then(m => m.default)
                }
              ],
              "isLayout": false,
              "isReset": false,
              "isIndex": false,
              "isFallback": false,
              "isPage": false,
              "ownMeta": {},
              "meta": {
                "preload": false,
                "prerender": true,
                "precache-order": false,
                "precache-proximity": true,
                "recursive": true
              },
              "path": "/fetch/prefetch"
            },
            {
              "isFile": true,
              "isDir": false,
              "file": "_layout.svelte",
              "filepath": "/fetch/_layout.svelte",
              "name": "_layout",
              "ext": "svelte",
              "badExt": false,
              "absolutePath": "C:/Users/jakob/sandbox/svelte/dev/svelte-filerouter/example2/src/pages/fetch/_layout.svelte",
              "isLayout": true,
              "isReset": false,
              "isIndex": false,
              "isFallback": false,
              "isPage": false,
              "ownMeta": {},
              "meta": {
                "preload": false,
                "prerender": true,
                "precache-order": false,
                "precache-proximity": true,
                "recursive": true
              },
              "path": "/fetch",
              "id": "_fetch__layout",
              "component": () => Promise.resolve().then(function () { return _layout$2; }).then(m => m.default)
            }
          ],
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": false,
          "ownMeta": {
            "index": 200
          },
          "meta": {
            "index": 200,
            "preload": false,
            "prerender": true,
            "precache-order": false,
            "precache-proximity": true,
            "recursive": true
          },
          "path": "/fetch"
        },
        {
          "isFile": true,
          "isDir": false,
          "file": "index.svelte",
          "filepath": "/index.svelte",
          "name": "index",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "C:/Users/jakob/sandbox/svelte/dev/svelte-filerouter/example2/src/pages/index.svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": true,
          "isFallback": false,
          "isPage": true,
          "ownMeta": {},
          "meta": {
            "preload": false,
            "prerender": true,
            "precache-order": false,
            "precache-proximity": true,
            "recursive": true
          },
          "path": "/index",
          "id": "_index",
          "component": () => Promise.resolve().then(function () { return index$3; }).then(m => m.default)
        },
        {
          "isFile": true,
          "isDir": false,
          "file": "_layout.svelte",
          "filepath": "/_layout.svelte",
          "name": "_layout",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "C:/Users/jakob/sandbox/svelte/dev/svelte-filerouter/example2/src/pages/_layout.svelte",
          "isLayout": true,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": false,
          "ownMeta": {},
          "meta": {
            "preload": false,
            "prerender": true,
            "precache-order": false,
            "precache-proximity": true,
            "recursive": true
          },
          "path": "/",
          "id": "__layout",
          "component": () => Promise.resolve().then(function () { return _layout$3; }).then(m => m.default)
        }
      ],
      "isLayout": false,
      "isReset": false,
      "isIndex": false,
      "isFallback": false,
      "meta": {
        "preload": false,
        "prerender": true,
        "precache-order": false,
        "precache-proximity": true,
        "recursive": true
      },
      "path": "/"
    };


    const {tree: tree$1, routes: routes$2} = buildClientTree(_tree);
    const oldHelper = document.getElementById('__routify-helper');
    if (oldHelper) oldHelper.remove();
    new Helper({
        target: document.body,
        props: {tree: tree$1, routes: routes$2, port: 13940}
    });

    /* src\ServiceWorker.svelte generated by Svelte v3.22.2 */

    const { console: console_1$1 } = globals;
    const file$a = "src\\ServiceWorker.svelte";

    // (58:0) {#if prompt}
    function create_if_block_1$4(ctx) {
    	let div;
    	let p;
    	let t0;
    	let a0;
    	let t1;
    	let t2;
    	let a1;
    	let t3;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text("Update available.\r\n      ");
    			a0 = element("a");
    			t1 = text("Update");
    			t2 = space();
    			a1 = element("a");
    			t3 = text("×");
    			this.h();
    		},
    		l: function claim(nodes) {
    			div = claim_element(nodes, "DIV", { class: true });
    			var div_nodes = children(div);
    			p = claim_element(div_nodes, "P", { class: true });
    			var p_nodes = children(p);
    			t0 = claim_text(p_nodes, "Update available.\r\n      ");
    			a0 = claim_element(p_nodes, "A", { href: true, class: true });
    			var a0_nodes = children(a0);
    			t1 = claim_text(a0_nodes, "Update");
    			a0_nodes.forEach(detach_dev);
    			t2 = claim_space(p_nodes);
    			a1 = claim_element(p_nodes, "A", { href: true, class: true });
    			var a1_nodes = children(a1);
    			t3 = claim_text(a1_nodes, "×");
    			a1_nodes.forEach(detach_dev);
    			p_nodes.forEach(detach_dev);
    			div_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(a0, "href", "/update");
    			attr_dev(a0, "class", "svelte-yibtsq");
    			add_location(a0, file$a, 61, 6, 1460);
    			attr_dev(a1, "href", "/close");
    			attr_dev(a1, "class", "close svelte-yibtsq");
    			add_location(a1, file$a, 62, 6, 1521);
    			attr_dev(p, "class", "svelte-yibtsq");
    			add_location(p, file$a, 59, 4, 1424);
    			attr_dev(div, "class", "svelte-yibtsq");
    			add_location(div, file$a, 58, 2, 1413);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(p, a0);
    			append_dev(a0, t1);
    			append_dev(p, t2);
    			append_dev(p, a1);
    			append_dev(a1, t3);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(
    					a0,
    					"click",
    					function () {
    						if (is_function(/*prompt*/ ctx[0].accept)) /*prompt*/ ctx[0].accept.apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				),
    				listen_dev(a1, "click", /*click_handler*/ ctx[2], false, false, false)
    			];
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(58:0) {#if prompt}",
    		ctx
    	});

    	return block;
    }

    // (68:0) {#if justInstalled}
    function create_if_block$8(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text("Just installed");
    			this.h();
    		},
    		l: function claim(nodes) {
    			div = claim_element(nodes, "DIV", { id: true, class: true });
    			var div_nodes = children(div);
    			t = claim_text(div_nodes, "Just installed");
    			div_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(div, "id", "justInstalled");
    			attr_dev(div, "class", "svelte-yibtsq");
    			add_location(div, file$a, 68, 2, 1645);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(68:0) {#if justInstalled}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let t;
    	let if_block1_anchor;
    	let if_block0 = /*prompt*/ ctx[0] && create_if_block_1$4(ctx);
    	let if_block1 = /*justInstalled*/ ctx[1] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			if (if_block0) if_block0.l(nodes);
    			t = claim_space(nodes);
    			if (if_block1) if_block1.l(nodes);
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*prompt*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$4(ctx);
    					if_block0.c();
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*justInstalled*/ ctx[1]) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block$8(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	console.log("ffs");
    	let prompt = false;
    	let justInstalled = false;

    	if ("serviceWorker" in navigator) {
    		Promise.resolve().then(function () { return workboxWindow_prod_es5; }).then(async ({ Workbox, messageSW }) => {
    			const wb = new Workbox("/sw.js");
    			const _messageSW = messageSW;
    			wb.addEventListener("installed", () => $$invalidate(1, justInstalled = true));
    			wb.addEventListener("externalinstalled", () => $$invalidate(1, justInstalled = true));
    			wb.addEventListener("waiting", showPrompt);
    			wb.addEventListener("externalwaiting", showPrompt);
    			const registration = await wb.register();

    			function showPrompt(event) {
    				$$invalidate(0, prompt = {
    					accept: async e => {
    						e.preventDefault();
    						wb.addEventListener("controlling", event => window.location.reload());

    						if (registration && registration.waiting) {
    							_messageSW(registration.waiting, { type: "SKIP_WAITING" });
    						}
    					}
    				});
    			}
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<ServiceWorker> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("ServiceWorker", $$slots, []);
    	const click_handler = () => $$invalidate(0, prompt = false);
    	$$self.$capture_state = () => ({ prompt, justInstalled });

    	$$self.$inject_state = $$props => {
    		if ("prompt" in $$props) $$invalidate(0, prompt = $$props.prompt);
    		if ("justInstalled" in $$props) $$invalidate(1, justInstalled = $$props.justInstalled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [prompt, justInstalled, click_handler];
    }

    class ServiceWorker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ServiceWorker",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.22.2 */

    const { console: console_1$2 } = globals;

    function create_fragment$e(ctx) {
    	let t;
    	let current;
    	const router = new Router({ props: { routes: routes$2 }, $$inline: true });
    	const serviceworker = new ServiceWorker({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    			t = space();
    			create_component(serviceworker.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(router.$$.fragment, nodes);
    			t = claim_space(nodes);
    			claim_component(serviceworker.$$.fragment, nodes);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(serviceworker, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			transition_in(serviceworker.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			transition_out(serviceworker.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(serviceworker, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	console.log(routes$2);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	$$self.$capture_state = () => ({
    		setContext,
    		Router,
    		routes: routes$2,
    		writable,
    		ServiceWorker
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    const app = HMR(App, { target: document.body }, 'routify-app');

    /* src\pages\fetch\batch\index.svelte generated by Svelte v3.22.2 */

    function create_fragment$f(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("index content");
    		},
    		l: function claim(nodes) {
    			t = claim_text(nodes, "index content");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Batch> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Batch", $$slots, []);
    	return [];
    }

    class Batch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Batch",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    var index = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Batch
    });

    /* src\pages\fetch\batch\page0.svelte generated by Svelte v3.22.2 */

    function create_fragment$g(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Page 0 content");
    		},
    		l: function claim(nodes) {
    			t = claim_text(nodes, "Page 0 content");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Page0> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Page0", $$slots, []);
    	return [];
    }

    class Page0 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Page0",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    var page0 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Page0
    });

    /* src\pages\fetch\batch\page1.svelte generated by Svelte v3.22.2 */

    function create_fragment$h(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Page 1 content");
    		},
    		l: function claim(nodes) {
    			t = claim_text(nodes, "Page 1 content");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Page1> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Page1", $$slots, []);
    	return [];
    }

    class Page1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Page1",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    var page1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Page1
    });

    /* src\pages\fetch\batch\page2.svelte generated by Svelte v3.22.2 */

    function create_fragment$i(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Page 2 content");
    		},
    		l: function claim(nodes) {
    			t = claim_text(nodes, "Page 2 content");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Page2> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Page2", $$slots, []);
    	return [];
    }

    class Page2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Page2",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    var page2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Page2
    });

    /* src\pages\fetch\batch\page3.svelte generated by Svelte v3.22.2 */

    function create_fragment$j(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Page 3 content");
    		},
    		l: function claim(nodes) {
    			t = claim_text(nodes, "Page 3 content");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Page3> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Page3", $$slots, []);
    	return [];
    }

    class Page3 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Page3",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    var page3 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Page3
    });

    /* src\pages\fetch\batch\page4.svelte generated by Svelte v3.22.2 */

    function create_fragment$k(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Page 4 content");
    		},
    		l: function claim(nodes) {
    			t = claim_text(nodes, "Page 4 content");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Page4> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Page4", $$slots, []);
    	return [];
    }

    class Page4 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Page4",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    var page4 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Page4
    });

    /* src\pages\fetch\batch\page5.svelte generated by Svelte v3.22.2 */

    function create_fragment$l(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Page 5 content");
    		},
    		l: function claim(nodes) {
    			t = claim_text(nodes, "Page 5 content");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Page5> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Page5", $$slots, []);
    	return [];
    }

    class Page5 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Page5",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    var page5 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Page5
    });

    /* src\pages\fetch\batch\page6.svelte generated by Svelte v3.22.2 */

    function create_fragment$m(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Page 6 content");
    		},
    		l: function claim(nodes) {
    			t = claim_text(nodes, "Page 6 content");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Page6> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Page6", $$slots, []);
    	return [];
    }

    class Page6 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Page6",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    var page6 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Page6
    });

    /* src\pages\fetch\batch\page7.svelte generated by Svelte v3.22.2 */

    function create_fragment$n(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Page 7 content");
    		},
    		l: function claim(nodes) {
    			t = claim_text(nodes, "Page 7 content");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Page7> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Page7", $$slots, []);
    	return [];
    }

    class Page7 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Page7",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    var page7 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Page7
    });

    /* src\pages\fetch\batch\page8.svelte generated by Svelte v3.22.2 */

    function create_fragment$o(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Page 8 content");
    		},
    		l: function claim(nodes) {
    			t = claim_text(nodes, "Page 8 content");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Page8> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Page8", $$slots, []);
    	return [];
    }

    class Page8 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Page8",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    var page8 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Page8
    });

    /* src\pages\fetch\batch\page9.svelte generated by Svelte v3.22.2 */

    function create_fragment$p(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Page 9 content");
    		},
    		l: function claim(nodes) {
    			t = claim_text(nodes, "Page 9 content");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Page9> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Page9", $$slots, []);
    	return [];
    }

    class Page9 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Page9",
    			options,
    			id: create_fragment$p.name
    		});
    	}
    }

    var page9 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Page9
    });

    /* src\pages\fetch\batch\_layout.svelte generated by Svelte v3.22.2 */

    function create_fragment$q(ctx) {
    	let t;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			t = text("layouts\r\n");
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			t = claim_text(nodes, "layouts\r\n");
    			if (default_slot) default_slot.l(nodes);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[0], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null));
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	setTimeout(
    		() => {
    			
    		},
    		1000
    	); // $ready()
    	// $ready()

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Layout> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Layout", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ ready });
    	return [$$scope, $$slots];
    }

    class Layout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Layout",
    			options,
    			id: create_fragment$q.name
    		});
    	}
    }

    var _layout = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Layout
    });

    /* src\pages\fetch\index.svelte generated by Svelte v3.22.2 */
    const file$b = "src\\pages\\fetch\\index.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (14:0) {#each batchNodes as child}
    function create_each_block$4(ctx) {
    	let a;
    	let t_value = /*child*/ ctx[3].title + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			this.h();
    		},
    		l: function claim(nodes) {
    			a = claim_element(nodes, "A", { href: true });
    			var a_nodes = children(a);
    			t = claim_text(a_nodes, t_value);
    			a_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(a, "href", a_href_value = /*$url*/ ctx[0](/*child*/ ctx[3].path));
    			add_location(a, file$b, 14, 2, 342);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$url*/ 1 && a_href_value !== (a_href_value = /*$url*/ ctx[0](/*child*/ ctx[3].path))) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(14:0) {#each batchNodes as child}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let t0;
    	let a;
    	let t1;
    	let each_value = /*batchNodes*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			a = element("a");
    			t1 = text("users");
    			this.h();
    		},
    		l: function claim(nodes) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(nodes);
    			}

    			t0 = claim_space(nodes);
    			a = claim_element(nodes, "A", { href: true });
    			var a_nodes = children(a);
    			t1 = claim_text(a_nodes, "users");
    			a_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(a, "href", "/fetch/users");
    			add_location(a, file$b, 17, 0, 399);
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, a, anchor);
    			append_dev(a, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$url, batchNodes*/ 3) {
    				each_value = /*batchNodes*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t0.parentNode, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let $layout;
    	let $url;
    	validate_store(layout, "layout");
    	component_subscribe($$self, layout, $$value => $$invalidate(2, $layout = $$value));
    	validate_store(url, "url");
    	component_subscribe($$self, url, $$value => $$invalidate(0, $url = $$value));

    	setTimeout(
    		() => {
    			
    		},
    		2000
    	); // prefetch('/fetch/users')
    	// prefetch('/fetch/users')

    	const batchNodes = $layout.parent.children.find(c => c.path === "/fetch/batch").children;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Fetch> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Fetch", $$slots, []);

    	$$self.$capture_state = () => ({
    		prefetch: prefetch$1,
    		layout,
    		url,
    		batchNodes,
    		$layout,
    		$url
    	});

    	return [$url, batchNodes];
    }

    class Fetch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Fetch",
    			options,
    			id: create_fragment$r.name
    		});
    	}
    }

    var index$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Fetch
    });

    /* src\pages\fetch\prefetch\delay0.svelte generated by Svelte v3.22.2 */
    const file$c = "src\\pages\\fetch\\prefetch\\delay0.svelte";

    // (1:0) <script>    import { ready }
    function create_catch_block(ctx) {
    	const block = {
    		c: noop,
    		l: noop,
    		m: noop,
    		p: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script>    import { ready }",
    		ctx
    	});

    	return block;
    }

    // (15:26) {JSON.stringify(value)}
    function create_then_block(ctx) {
    	let t_value = JSON.stringify(/*value*/ ctx[2]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		l: function claim(nodes) {
    			t = claim_text(nodes, t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(15:26) {JSON.stringify(value)}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>    import { ready }
    function create_pending_block(ctx) {
    	const block = {
    		c: noop,
    		l: noop,
    		m: noop,
    		p: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(1:0) <script>    import { ready }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let h1;
    	let t0;
    	let t1;
    	let div;
    	let promise;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 2
    	};

    	handle_promise(promise = /*data*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text("Delay 0");
    			t1 = space();
    			div = element("div");
    			info.block.c();
    			this.h();
    		},
    		l: function claim(nodes) {
    			h1 = claim_element(nodes, "H1", {});
    			var h1_nodes = children(h1);
    			t0 = claim_text(h1_nodes, "Delay 0");
    			h1_nodes.forEach(detach_dev);
    			t1 = claim_space(nodes);
    			div = claim_element(nodes, "DIV", { class: true });
    			var div_nodes = children(div);
    			info.block.l(div_nodes);
    			div_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			add_location(h1, file$c, 12, 0, 277);
    			attr_dev(div, "class", "result");
    			add_location(div, file$c, 13, 0, 295);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			info.block.m(div, info.anchor = null);
    			info.mount = () => div;
    			info.anchor = null;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			{
    				const child_ctx = ctx.slice();
    				child_ctx[2] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let $ready;
    	validate_store(ready, "ready");
    	component_subscribe($$self, ready, $$value => $$invalidate(1, $ready = $$value));
    	const data = fetch("https://www.mocky.io/v2/5185415ba171ea3a00704eed").then(res => res.json()).then(res => $ready() && res);

    	setTimeout(
    		() => {
    			parent.postMessage("hello");
    		},
    		500
    	);

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Delay0> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Delay0", $$slots, []);
    	$$self.$capture_state = () => ({ ready, data, $ready });
    	return [data];
    }

    class Delay0 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Delay0",
    			options,
    			id: create_fragment$s.name
    		});
    	}
    }

    var delay0 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Delay0
    });

    /* src\pages\fetch\prefetch\delay1.svelte generated by Svelte v3.22.2 */
    const file$d = "src\\pages\\fetch\\prefetch\\delay1.svelte";

    // (1:0) <script>    import { ready }
    function create_catch_block$1(ctx) {
    	const block = {
    		c: noop,
    		l: noop,
    		m: noop,
    		p: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$1.name,
    		type: "catch",
    		source: "(1:0) <script>    import { ready }",
    		ctx
    	});

    	return block;
    }

    // (15:24) {JSON.stringify(value)}
    function create_then_block$1(ctx) {
    	let t_value = JSON.stringify(/*value*/ ctx[2]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		l: function claim(nodes) {
    			t = claim_text(nodes, t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$1.name,
    		type: "then",
    		source: "(15:24) {JSON.stringify(value)}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>    import { ready }
    function create_pending_block$1(ctx) {
    	const block = {
    		c: noop,
    		l: noop,
    		m: noop,
    		p: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$1.name,
    		type: "pending",
    		source: "(1:0) <script>    import { ready }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
    	let h1;
    	let t0;
    	let t1;
    	let await_block_anchor;
    	let promise;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1,
    		value: 2
    	};

    	handle_promise(promise = /*data*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text("Delay 1");
    			t1 = space();
    			await_block_anchor = empty();
    			info.block.c();
    			this.h();
    		},
    		l: function claim(nodes) {
    			h1 = claim_element(nodes, "H1", {});
    			var h1_nodes = children(h1);
    			t0 = claim_text(h1_nodes, "Delay 1");
    			h1_nodes.forEach(detach_dev);
    			t1 = claim_space(nodes);
    			await_block_anchor = empty();
    			info.block.l(nodes);
    			this.h();
    		},
    		h: function hydrate() {
    			add_location(h1, file$d, 13, 0, 301);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			{
    				const child_ctx = ctx.slice();
    				child_ctx[2] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let $ready;
    	validate_store(ready, "ready");
    	component_subscribe($$self, ready, $$value => $$invalidate(1, $ready = $$value));
    	const data = fetch("https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay=1000ms").then(res => res.json()).then(res => $ready() && res);

    	setTimeout(
    		() => {
    			parent.postMessage("hello");
    		},
    		500
    	);

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Delay1> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Delay1", $$slots, []);
    	$$self.$capture_state = () => ({ ready, data, $ready });
    	return [data];
    }

    class Delay1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Delay1",
    			options,
    			id: create_fragment$t.name
    		});
    	}
    }

    var delay1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Delay1
    });

    /* src\pages\fetch\prefetch\delay2.svelte generated by Svelte v3.22.2 */
    const file$e = "src\\pages\\fetch\\prefetch\\delay2.svelte";

    // (1:0) <script>    import { ready }
    function create_catch_block$2(ctx) {
    	const block = {
    		c: noop,
    		l: noop,
    		m: noop,
    		p: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$2.name,
    		type: "catch",
    		source: "(1:0) <script>    import { ready }",
    		ctx
    	});

    	return block;
    }

    // (15:24) {JSON.stringify(value)}
    function create_then_block$2(ctx) {
    	let t_value = JSON.stringify(/*value*/ ctx[2]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		l: function claim(nodes) {
    			t = claim_text(nodes, t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$2.name,
    		type: "then",
    		source: "(15:24) {JSON.stringify(value)}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>    import { ready }
    function create_pending_block$2(ctx) {
    	const block = {
    		c: noop,
    		l: noop,
    		m: noop,
    		p: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$2.name,
    		type: "pending",
    		source: "(1:0) <script>    import { ready }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
    	let h1;
    	let t0;
    	let t1;
    	let await_block_anchor;
    	let promise;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block$2,
    		then: create_then_block$2,
    		catch: create_catch_block$2,
    		value: 2
    	};

    	handle_promise(promise = /*data*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text("Delay 2");
    			t1 = space();
    			await_block_anchor = empty();
    			info.block.c();
    			this.h();
    		},
    		l: function claim(nodes) {
    			h1 = claim_element(nodes, "H1", {});
    			var h1_nodes = children(h1);
    			t0 = claim_text(h1_nodes, "Delay 2");
    			h1_nodes.forEach(detach_dev);
    			t1 = claim_space(nodes);
    			await_block_anchor = empty();
    			info.block.l(nodes);
    			this.h();
    		},
    		h: function hydrate() {
    			add_location(h1, file$e, 13, 0, 301);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			{
    				const child_ctx = ctx.slice();
    				child_ctx[2] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let $ready;
    	validate_store(ready, "ready");
    	component_subscribe($$self, ready, $$value => $$invalidate(1, $ready = $$value));
    	const data = fetch("https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay=2000ms").then(res => res.json()).then(res => $ready() && res);

    	setTimeout(
    		() => {
    			parent.postMessage("hello");
    		},
    		500
    	);

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Delay2> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Delay2", $$slots, []);
    	$$self.$capture_state = () => ({ ready, data, $ready });
    	return [data];
    }

    class Delay2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Delay2",
    			options,
    			id: create_fragment$u.name
    		});
    	}
    }

    var delay2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Delay2
    });

    /* src\pages\fetch\prefetch\index.svelte generated by Svelte v3.22.2 */

    const { console: console_1$3 } = globals;
    const file$f = "src\\pages\\fetch\\prefetch\\index.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (11:0) {#each $layout.parent.children as child}
    function create_each_block$5(ctx) {
    	let div;
    	let button;
    	let t0_value = /*child*/ ctx[3].path + "";
    	let t0;
    	let button_class_value;
    	let t1;
    	let a;
    	let t2_value = /*child*/ ctx[3].path + "";
    	let t2;
    	let a_href_value;
    	let t3;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			a = element("a");
    			t2 = text(t2_value);
    			t3 = space();
    			this.h();
    		},
    		l: function claim(nodes) {
    			div = claim_element(nodes, "DIV", { id: true });
    			var div_nodes = children(div);
    			button = claim_element(div_nodes, "BUTTON", { class: true });
    			var button_nodes = children(button);
    			t0 = claim_text(button_nodes, t0_value);
    			button_nodes.forEach(detach_dev);
    			t1 = claim_space(div_nodes);
    			a = claim_element(div_nodes, "A", { href: true });
    			var a_nodes = children(a);
    			t2 = claim_text(a_nodes, t2_value);
    			a_nodes.forEach(detach_dev);
    			t3 = claim_space(div_nodes);
    			div_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(button, "class", button_class_value = /*child*/ ctx[3].title);
    			add_location(button, file$f, 12, 4, 273);
    			attr_dev(a, "href", a_href_value = /*$url*/ ctx[1](/*child*/ ctx[3].path));
    			add_location(a, file$f, 13, 4, 366);
    			attr_dev(div, "id", "prefetch");
    			add_location(div, file$f, 11, 2, 248);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, t0);
    			append_dev(div, t1);
    			append_dev(div, a);
    			append_dev(a, t2);
    			append_dev(div, t3);
    			if (remount) dispose();

    			dispose = listen_dev(
    				button,
    				"click",
    				function () {
    					if (is_function(/*prefetchPath*/ ctx[2](/*child*/ ctx[3].path))) /*prefetchPath*/ ctx[2](/*child*/ ctx[3].path).apply(this, arguments);
    				},
    				false,
    				false,
    				false
    			);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$layout*/ 1 && t0_value !== (t0_value = /*child*/ ctx[3].path + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*$layout*/ 1 && button_class_value !== (button_class_value = /*child*/ ctx[3].title)) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty & /*$layout*/ 1 && t2_value !== (t2_value = /*child*/ ctx[3].path + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*$url, $layout*/ 3 && a_href_value !== (a_href_value = /*$url*/ ctx[1](/*child*/ ctx[3].path))) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(11:0) {#each $layout.parent.children as child}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$v(ctx) {
    	let h3;
    	let t0;
    	let t1;
    	let each_1_anchor;
    	let each_value = /*$layout*/ ctx[0].parent.children;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text("Prefetch an url");
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			this.h();
    		},
    		l: function claim(nodes) {
    			h3 = claim_element(nodes, "H3", {});
    			var h3_nodes = children(h3);
    			t0 = claim_text(h3_nodes, "Prefetch an url");
    			h3_nodes.forEach(detach_dev);
    			t1 = claim_space(nodes);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(nodes);
    			}

    			each_1_anchor = empty();
    			this.h();
    		},
    		h: function hydrate() {
    			add_location(h3, file$f, 9, 0, 178);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$url, $layout, prefetchPath*/ 7) {
    				each_value = /*$layout*/ ctx[0].parent.children;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let $layout;
    	let $url;
    	validate_store(layout, "layout");
    	component_subscribe($$self, layout, $$value => $$invalidate(0, $layout = $$value));
    	validate_store(url, "url");
    	component_subscribe($$self, url, $$value => $$invalidate(1, $url = $$value));

    	function prefetchPath(e) {
    		prefetch$1(e);
    	}

    	console.log($layout.parent.children);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$3.warn(`<Prefetch> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Prefetch", $$slots, []);

    	$$self.$capture_state = () => ({
    		prefetch: prefetch$1,
    		layout,
    		url,
    		prefetchPath,
    		$layout,
    		$url
    	});

    	return [$layout, $url, prefetchPath];
    }

    class Prefetch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Prefetch",
    			options,
    			id: create_fragment$v.name
    		});
    	}
    }

    var index$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Prefetch
    });

    /* src\pages\fetch\prefetch\_layout.svelte generated by Svelte v3.22.2 */

    function create_fragment$w(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			if (default_slot) default_slot.l(nodes);
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[0], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null));
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Layout> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Layout", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, $$slots];
    }

    class Layout$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Layout",
    			options,
    			id: create_fragment$w.name
    		});
    	}
    }

    var _layout$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Layout$1
    });

    /* src\pages\fetch\_layout.svelte generated by Svelte v3.22.2 */

    function create_fragment$x(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			if (default_slot) default_slot.l(nodes);
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[0], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null));
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Layout> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Layout", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, $$slots];
    }

    class Layout$2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Layout",
    			options,
    			id: create_fragment$x.name
    		});
    	}
    }

    var _layout$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Layout$2
    });

    /* src\pages\index.svelte generated by Svelte v3.22.2 */

    function create_fragment$y(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("pages/index.svelte abcasd23");
    		},
    		l: function claim(nodes) {
    			t = claim_text(nodes, "pages/index.svelte abcasd23");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Pages> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Pages", $$slots, []);
    	return [];
    }

    class Pages extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$y, create_fragment$y, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pages",
    			options,
    			id: create_fragment$y.name
    		});
    	}
    }

    var index$3 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Pages
    });

    /* src\pages\_layout.svelte generated by Svelte v3.22.2 */
    const file$g = "src\\pages\\_layout.svelte";

    function create_fragment$z(ctx) {
    	let h1;
    	let t0_value = /*$page*/ ctx[0].title + "";
    	let t0;
    	let t1;
    	let h3;
    	let t2_value = /*$page*/ ctx[0].__file.path + "";
    	let t2;
    	let t3;
    	let t4_value = /*$page*/ ctx[0].__file.ext + "";
    	let t4;
    	let t5;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			h3 = element("h3");
    			t2 = text(t2_value);
    			t3 = text(".");
    			t4 = text(t4_value);
    			t5 = space();
    			if (default_slot) default_slot.c();
    			this.h();
    		},
    		l: function claim(nodes) {
    			h1 = claim_element(nodes, "H1", {});
    			var h1_nodes = children(h1);
    			t0 = claim_text(h1_nodes, t0_value);
    			h1_nodes.forEach(detach_dev);
    			t1 = claim_space(nodes);
    			h3 = claim_element(nodes, "H3", {});
    			var h3_nodes = children(h3);
    			t2 = claim_text(h3_nodes, t2_value);
    			t3 = claim_text(h3_nodes, ".");
    			t4 = claim_text(h3_nodes, t4_value);
    			h3_nodes.forEach(detach_dev);
    			t5 = claim_space(nodes);
    			if (default_slot) default_slot.l(nodes);
    			this.h();
    		},
    		h: function hydrate() {
    			add_location(h1, file$g, 4, 0, 67);
    			add_location(h3, file$g, 5, 0, 91);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t2);
    			append_dev(h3, t3);
    			append_dev(h3, t4);
    			insert_dev(target, t5, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*$page*/ 1) && t0_value !== (t0_value = /*$page*/ ctx[0].title + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*$page*/ 1) && t2_value !== (t2_value = /*$page*/ ctx[0].__file.path + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*$page*/ 1) && t4_value !== (t4_value = /*$page*/ ctx[0].__file.ext + "")) set_data_dev(t4, t4_value);

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 2) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[1], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null));
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t5);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$z($$self, $$props, $$invalidate) {
    	let $page;
    	validate_store(page, "page");
    	component_subscribe($$self, page, $$value => $$invalidate(0, $page = $$value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Layout> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Layout", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ page, $page });
    	return [$page, $$scope, $$slots];
    }

    class Layout$3 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$z, create_fragment$z, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Layout",
    			options,
    			id: create_fragment$z.name
    		});
    	}
    }

    var _layout$3 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Layout$3
    });

    try{self["workbox:window:5.1.3"]&&_();}catch(n){}function n(n,t){return new Promise((function(r){var i=new MessageChannel;i.port1.onmessage=function(n){r(n.data);},n.postMessage(t,[i.port2]);}))}function t(n,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(n,i.key,i);}}try{self["workbox:core:5.1.3"]&&_();}catch(n){}var r=function(){var n=this;this.promise=new Promise((function(t,r){n.resolve=t,n.reject=r;}));};function i(n,t){var r=location.href;return new URL(n,r).href===new URL(t,r).href}var e=function(n,t){this.type=n,Object.assign(this,t);};function o(n,t,r){return r?t?t(n):n:(n&&n.then||(n=Promise.resolve(n)),t?n.then(t):n)}function u(){}var a=function(u){var a,f;function s(n,t){var a,c;return void 0===t&&(t={}),(a=u.call(this)||this).t={},a.i=0,a.o=new r,a.u=new r,a.s=new r,a.v=0,a.h=new Set,a.l=function(){var n=a.g,t=n.installing;a.i>0||!i(t.scriptURL,a.m)||performance.now()>a.v+6e4?(a.P=t,n.removeEventListener("updatefound",a.l)):(a.p=t,a.h.add(t),a.o.resolve(t)),++a.i,t.addEventListener("statechange",a.k);},a.k=function(n){var t=a.g,r=n.target,i=r.state,o=r===a.P,u=o?"external":"",c={sw:r,originalEvent:n};!o&&a.j&&(c.isUpdate=!0),a.dispatchEvent(new e(u+i,c)),"installed"===i?a.O=self.setTimeout((function(){"installed"===i&&t.waiting===r&&a.dispatchEvent(new e(u+"waiting",c));}),200):"activating"===i&&(clearTimeout(a.O),o||a.u.resolve(r));},a.R=function(n){var t=a.p;t===navigator.serviceWorker.controller&&(a.dispatchEvent(new e("controlling",{sw:t,originalEvent:n,isUpdate:a.j})),a.s.resolve(t));},a.S=(c=function(n){var t=n.data,r=n.source;return o(a.getSW(),(function(){a.h.has(r)&&a.dispatchEvent(new e("message",{data:t,sw:r,originalEvent:n}));}))},function(){for(var n=[],t=0;t<arguments.length;t++)n[t]=arguments[t];try{return Promise.resolve(c.apply(this,n))}catch(n){return Promise.reject(n)}}),a.m=n,a.t=t,navigator.serviceWorker.addEventListener("message",a.S),a}f=u,(a=s).prototype=Object.create(f.prototype),a.prototype.constructor=a,a.__proto__=f;var v,h,l=s.prototype;return l.register=function(n){var t=(void 0===n?{}:n).immediate,r=void 0!==t&&t;try{var u=this;return function(n,t){var r=n();if(r&&r.then)return r.then(t);return t(r)}((function(){if(!r&&"complete"!==document.readyState)return c(new Promise((function(n){return window.addEventListener("load",n)})))}),(function(){return u.j=Boolean(navigator.serviceWorker.controller),u.U=u.B(),o(u.L(),(function(n){u.g=n,u.U&&(u.p=u.U,u.u.resolve(u.U),u.s.resolve(u.U),u.U.addEventListener("statechange",u.k,{once:!0}));var t=u.g.waiting;return t&&i(t.scriptURL,u.m)&&(u.p=t,Promise.resolve().then((function(){u.dispatchEvent(new e("waiting",{sw:t,wasWaitingBeforeRegister:!0}));})).then((function(){}))),u.p&&(u.o.resolve(u.p),u.h.add(u.p)),u.g.addEventListener("updatefound",u.l),navigator.serviceWorker.addEventListener("controllerchange",u.R,{once:!0}),u.g}))}))}catch(n){return Promise.reject(n)}},l.update=function(){try{return this.g?c(this.g.update()):void 0}catch(n){return Promise.reject(n)}},l.getSW=function(){try{return void 0!==this.p?this.p:this.o.promise}catch(n){return Promise.reject(n)}},l.messageSW=function(t){try{return o(this.getSW(),(function(r){return n(r,t)}))}catch(n){return Promise.reject(n)}},l.B=function(){var n=navigator.serviceWorker.controller;return n&&i(n.scriptURL,this.m)?n:void 0},l.L=function(){try{var n=this;return function(n,t){try{var r=n();}catch(n){return t(n)}if(r&&r.then)return r.then(void 0,t);return r}((function(){return o(navigator.serviceWorker.register(n.m,n.t),(function(t){return n.v=performance.now(),t}))}),(function(n){throw n}))}catch(n){return Promise.reject(n)}},v=s,(h=[{key:"active",get:function(){return this.u.promise}},{key:"controlling",get:function(){return this.s.promise}}])&&t(v.prototype,h),s}(function(){function n(){this.M=new Map;}var t=n.prototype;return t.addEventListener=function(n,t){this._(n).add(t);},t.removeEventListener=function(n,t){this._(n).delete(t);},t.dispatchEvent=function(n){n.target=this;var t=this._(n.type),r=Array.isArray(t),i=0;for(t=r?t:t[Symbol.iterator]();;){var e;if(r){if(i>=t.length)break;e=t[i++];}else {if((i=t.next()).done)break;e=i.value;}e(n);}},t._=function(n){return this.M.has(n)||this.M.set(n,new Set),this.M.get(n)},n}());function c(n,t){if(!t)return n&&n.then?n.then(u):Promise.resolve()}

    var workboxWindow_prod_es5 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Workbox: a,
        messageSW: n
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
