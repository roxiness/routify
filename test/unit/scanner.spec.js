import { test } from '..'

import { walkAsync } from '../../lib/services/scanner'

test('walkAsync', async t => {
  const tree = {
    dir: [
      {
        name: 'a',
        dir: [
          {
            name: 'a.1',
          },
          { name: 'a.2', dir: [{ name: 'a.2.1' }] },
        ],
      },
    ],
  }
  const results = []
  const walker = item => {
    results.push(item.name)
  }
  await walkAsync(walker)(tree)
  t.eq(results, ['a', 'a.1', 'a.2', 'a.2.1'])
})
