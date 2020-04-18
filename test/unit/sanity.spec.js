import { test } from '..'

test('the test framework', t => {
  t.test('works', t => {
    t.ok(true, 'indeed')
  })

  t.test('multiple times', t => {
    t.ok(true, 'two')
  })
})
