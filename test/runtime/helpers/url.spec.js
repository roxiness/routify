import { test, describe } from '../..'
import { makeUrlHelper } from '../../../runtime/helpers.js'

import { paths as specs } from './url.samples.js'

describe.skip('TODO: $url')

test('_url is a function', t => {
  t.equal(typeof makeUrlHelper, 'function')
})

const macro = (
  t,
  { path, expects, context: contextArg, route: routeArg, and }
) => {
  const context = { path, params: {}, ...contextArg }
  const route = { params: {}, ...routeArg }
  const $url = makeUrlHelper(context, route)
  // unfold expects
  const runExpect = ([input, expected]) => {
    // throws
    if (expected.throws) {
      t.test(`'${input}' throws '${expected.throws}'`, t => {
        t.throws(() => {
          const actual = $url(input)
          return actual
        }, expected.throws)
      })
    }
    // equal
    else {
      t.test(`'${input}' => '${expected}'`, t => {
        const actual = $url(input)
        t.equal(actual, expected)
      })
    }
  }
  if (Array.isArray(expects)) {
    expects.forEach(runExpect)
  } else {
    Object.entries(expects).forEach(runExpect)
  }
  // and
  if (and) {
    and(t, $url)
  }
}

macro.title = (title, { path }) => title || `from ${path}`

specs.forEach(spec => {
  test(macro, spec)
})
