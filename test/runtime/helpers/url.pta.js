import { _url } from '@/runtime/helpers.js'

export default t => {
  t.test('helpers: $url', async t => {
    t.test('_url factory exists', t => {
      t.equal(typeof _url, 'function')
    })

    const runSpec = ({
      path,
      expects,
      context: contextArg,
      route: routeArg,
      and,
    }) => {
      // $url
      t.test(`from ${path}`, t => {
        const context = { path, params: {}, ...contextArg }
        const route = { params: {}, ...routeArg }
        const $url = _url(context, route)
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
      })
    }

    const { paths: specs } = await import('./url.samples.js')

    specs.forEach(runSpec)
  })
}
