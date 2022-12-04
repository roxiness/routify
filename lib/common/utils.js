/**
 * @template {{}} T
 * @template {{}} T2
 * @param {T} receiver
 * @param  {...T2} sources
 * @return {T&Partial<T2>} //partial because we're not guaranteed that types are preserved
 */
export function deepAssign(receiver, ...sources) {
    for (const source of sources) {
        if (Array.isArray(source)) {
            // transform receiver to an array if the source is an array
            // @ts-ignore
            receiver = Array.isArray(receiver) ? receiver : []
            // @ts-ignore
            receiver.push(...source) // @ts-ignore
        } else
            for (const key of Reflect.ownKeys(source)) {
                if ([source[key], receiver[key]].every(isObjectOrArray)) {
                    receiver[key] = deepAssign(receiver[key], source[key])
                } else receiver[key] = source[key]
            }
    }
    return receiver
}

const isObject = v =>
    v &&
    typeof v === 'object' &&
    !['Array', 'Date', 'Regexp'].includes(v.constructor?.name)

export const isObjectOrArray = v => Array.isArray(v) || isObject(v)

/**
 * checks for repeating patterns to prevent infinite loops
 */
class RepetitionChecker {
    history = []
    /**
     * Pushes an entry to history. If the entry already exists, it checks
     * if the history between previously added entry and current entry is a
     * repetition. If so, it returns the repetition.
     * @param {any} entry
     * @returns {false|any[]}
     */
    pushAndCheck = entry => {
        const { history } = this
        const prevIndexCursor = history.lastIndexOf(entry) + 1
        history.push(entry)
        if (prevIndexCursor) {
            const lastIndexCursor = history.length
            const sliceLength = lastIndexCursor - prevIndexCursor
            const slice1 = history.slice(prevIndexCursor - sliceLength, prevIndexCursor)
            const slice2 = history.slice(prevIndexCursor)
            if (JSON.stringify(slice1) === JSON.stringify(slice2)) return slice2
        }
        return false
    }
}

/**
 * @param {RoutifyBuildtimePlugin[]} plugins
 * @returns {RoutifyBuildtimePlugin[]}
 */
export const normalizePlugins = plugins =>
    // clone, flatten and normalize
    plugins.flat().map(plugin => ({
        ...plugin,
        before: [].concat(plugin.before).filter(Boolean), //convert to, or keep as array
        after: [].concat(plugin.after).filter(Boolean), //convert to, or keep as array
    }))

/**
 * @param {RoutifyBuildtimePlugin[]} plugins
 * @returns {RoutifyBuildtimePlugin[]}
 */
export function sortPlugins(plugins) {
    const repetitionChecker = new RepetitionChecker()

    const _sort = () => {
        plugins.some((plugin1, index1) =>
            plugins.some((plugin2, index2) => {
                const plugin2ShouldPrecede =
                    plugin1.after.includes(plugin2.name) ||
                    plugin2.before.includes(plugin1.name)
                const plugin2DoesPrecede = index2 < index1
                if (plugin2ShouldPrecede && !plugin2DoesPrecede) {
                    // move plugin2 to the index of plugin1
                    plugins.splice(index2, 1) //remove
                    plugins.splice(index1, 0, plugin2) //insert

                    // make sure we're not stuck in a loop
                    const loop = repetitionChecker.pushAndCheck(plugin2)
                    if (loop)
                        // todo create loopException
                        throw new Error(
                            'found infinite loop in plugins. Repeating pattern:\n' +
                                `${loop
                                    .map(
                                        p =>
                                            `${p.name} (${['before', 'after']
                                                .map(name => `${name}: ${p[name]}`)
                                                .join('; ')} )`,
                                    )
                                    .join('\n')
                                    .replace(/before: ;/g, '')
                                    .replace(/after:  /g, '')
                                    .replace(/\( \)/g, '')}`,
                        )
                    _sort()
                    return true
                }
            }),
        )
    }

    _sort()

    return plugins
}

/**
 * mock routes from an object
 * @template {RoutifyBuildtime|RoutifyRuntime} T
 * @param {T} instance
 * @param {Object.<string, any>} routes
 * @example
 * mockRoutes(instance, {
 *   module: {
 *     about: {},
 *     posts: { '[slug]': {} },
 *     admin: { crud: {}, users: {} },
 *   },
 * })
 */
export const mockRoutes = (instance, routes) => {
    const rootNode = instance.createNode('module')
    const queue = [{ parent: rootNode, children: routes.module }]

    while (queue.length) {
        const job = queue.shift()
        Object.entries(job.children).forEach(([name, routes]) => {
            const parent = job.parent.createChild(name, '')
            parent.meta.name = name
            if (name.startsWith('[')) parent.meta.dynamic = true
            if (name.startsWith('[...')) parent.meta.dynamicSpread = true
            queue.push({
                /** @ts-ignore our mocked route is lacking a lot of properties */
                parent,
                children: routes,
            })
        })
    }

    return rootNode
}

/**
 * Adds props to a Svelte component
 * @example
 * const MyCompWithProps = addPropsToComp(MyComp, {msg: 'hello world'})
 * @template {typeof import('svelte/internal').SvelteComponentDev} Component
 * @param {Component} Comp
 * @param {Object<string, any>} props
 * @returns {Component}
 */
export const addPropsToComp = (Comp, props) => {
    const ssrWrapper = (Comp, props) => ({
        ...Comp,
        $$render: (...params) => {
            params[1] = { ...params[1], ...props }
            return Comp.$$render(...params)
        },
    })

    const domWrapper = (Comp, props) =>
        function (options) {
            return new Comp({ ...options, props: { ...options.props, ...props } })
        }

    const wrapper = Comp['$$render'] ? ssrWrapper : domWrapper

    return wrapper(Comp, props)
}

// todo fix types below. Callback param is any, but should be V. Probably needs overloading

/**
 * Returns store value on the next store update.
 * If wanted is specified, the value will only be returned once the value matches.
 * Wanted can be a callback.
 * @example
 * // returns the next value from clock
 * const hour = await next(clock)
 * @example
 * // resolves when clock is 5
 * await next(clock, 5)
 * @example
 * // resolves when clock is 5
 * const hour = await next(clock, val => val === 5)
 * @template {import('svelte/store').Readable<V>} T
 * @template V
 * @param {T} store
 * @param {((wanted: V)=>Boolean)|V=} wanted
 * @param {boolean=} strict use === matching instead of == for the wanted value
 * @returns {Promise<V>}
 */
export const next = (store, wanted, strict) =>
    new Promise(resolve => {
        let unsub
        unsub = store.subscribe(value => {
            // skip the first initial return
            if (!unsub) return
            if (
                typeof wanted === 'undefined' ||
                value === wanted ||
                (value == wanted && !strict) ||
                (typeof wanted === 'function' && /** @type {function} */ (wanted)(value))
            ) {
                resolve(value)
                unsub
            }
        })
    })

const createThrottle = () => {
    const map = new Map()

    const throttle = async fn => {
        const fnStr = fn.toString()
        map.set(fnStr, map.get(fnStr) || { isRunning: false, runAgain: false })
        const s = map.get(fnStr)

        if (s.isRunning) s.runAgain = true
        else {
            s.isRunning = true
            await fn()
            s.isRunning = false
            if (s.runAgain) {
                s.runAgain = false
                await throttle(fn)
            }
        }
    }
    return throttle
}

export const throttle = createThrottle()
