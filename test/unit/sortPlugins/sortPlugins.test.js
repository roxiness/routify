import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { sortPlugins } from '../../../common/utils.js'

const test = suite('sort plugins')

test('sortPlugins can sort plugins', async () => {
    const plugins = [
        { name: 'third', after: 'second' },
        { name: 'second' },
        { name: 'first', before: 'second' },
    ]

    const res = sortPlugins(plugins)
    assert.snapshot(res.map(p => p.name).join(','), 'first,second,third')
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

    const res = sortPlugins(plugins)
    assert.snapshot(res.map(p => p.name).join(','), 'first,second,third,fourth,fifth,sixth')
})

test('sortPlugins reports loops', async () => {
    const plugins = [
        { name: 'third', after: 'second' },
        { name: 'second' },
        { name: 'first', before: 'second' },
        { name: 'impossible', before: 'second', after: 'third' },
    ]

    try {
        sortPlugins(plugins)
    }catch(err){
        assert.snapshot(err.message,
            'found infinite loop in plugins. Repeating pattern:\n'+
            'impossible (before: second; after: third )\n'+
            'third ( after: second )\n'+
            'second '
        )
    }
})

test.run()