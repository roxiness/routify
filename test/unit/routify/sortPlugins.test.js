import { normalizePlugins, sortPlugins } from '../../../lib/common/utils.js'

test('sortPlugins can sort plugins', async () => {
    const plugins = [
        { name: 'third', after: 'second' },
        { name: 'second' },
        { name: 'first', before: 'second' },
    ]

    const res = sortPlugins(normalizePlugins(plugins))
    expect(res.map(p => p.name).join(',')).toBe('first,second,third')
})

test('sortPlugins preserves order when possible', async () => {
    const plugins = [
        { name: 'second', after: 'first' },
        { name: 'first' },
        { name: 'fourth' },
        { name: 'fifth' },
        { name: 'third', before: 'fourth' },
        { name: 'sixth' },
    ]

    const res = sortPlugins(normalizePlugins(plugins))
    expect(res.map(p => p.name).join(',')).toBe('first,second,third,fourth,fifth,sixth')
})

test('sortPlugins reports loops', async () => {
    const plugins = [
        { name: 'third', after: 'second' },
        { name: 'second' },
        { name: 'first', before: 'second' },
        { name: 'impossible', before: 'second', after: 'third' },
    ]

    try {
        sortPlugins(normalizePlugins(plugins))
    } catch (err) {
        expect(err.message).toBe(
            'found infinite loop in plugins. Repeating pattern:\n' +
                'impossible (before: second; after: third )\n' +
                'third ( after: second )\n' +
                'second ',
        )
    }
})
