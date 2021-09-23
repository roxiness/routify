import '../../typedef.js'

/**
 * @template {{}} T
 * @template {{}} T2
 * @param {T} target
 * @param  {...T2} sources
 * @return {T&Partial<T2>} //jsdoc unaware of mutation - incorrectly wants partial T2
 */
export function deepAssign(target, ...sources) {
    for (const source of sources) {
        if (Array.isArray(source)) {
            target = Array.isArray(target) ? target : []
            target.push(...source)
        } else
            for (const key of Reflect.ownKeys(source)) {
                if ([source[key], target[key]].every(isObjectOrArray)) {
                    target[key] = deepAssign(target[key], source[key])
                } else target[key] = source[key]
            }
    }
    return target
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
 * @param {RoutifyPlugin[]} _plugins
 * @returns {RoutifyPlugin[]}
 */
export const normalizePlugins = plugins =>
    // clone, flatten and normalize
    plugins.flat().map(plugin => ({
        ...plugin,
        before: [].concat(plugin.before).filter(Boolean), //convert to, or keep as array
        after: [].concat(plugin.after).filter(Boolean), //convert to, or keep as array
    }))

/**
 * @param {RoutifyPlugin[]} _plugins
 * @returns {RoutifyPlugin[]}
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
 * @template {Routify} T
 * @param {T} instance
 * @param {Object.<string, any>} routes
 */
export const mockRoutes = (instance, routes) => {
    const queue = [{ parent: instance.superNode, children: routes }]

    while (queue.length) {
        const job = queue.shift()
        Object.entries(job.children).forEach(([name, routes]) => {
            queue.push({
                parent: job.parent.createChild(name, ''),
                children: routes,
            })
        })
    }

    return instance
}
