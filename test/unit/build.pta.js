import { Volume } from 'memfs'
import * as path from 'path'

import fsa from '../../lib/utils/fsa'
import { Builder } from '../../lib/services/interface'

export default t => {
  t.test('build', async t => {
    const resolveSample = (...names) =>
      path.resolve(__dirname, 'build', ...names)

    const files = await fsa.readdir(resolveSample())

    const inputRe = /^(.+)\.input\.js$/

    const runSample = ([file, name]) => {
      t.test(name, async t => {
        const { default: spec } = await import(resolveSample(file))

        const vol = Volume.fromJSON(spec.files)

        const build = Builder(
          {
            ...spec.options,
            fsa: fsa.from(vol),
          },
          true
        )

        const actual = await build(true)

        const expectedFilename = resolveSample(`${name}.expected.js`)
        const hasExpected = await fsa.exists(expectedFilename)

        if (!hasExpected) {
          await fsa.writeFile(expectedFilename, actual, 'utf8')
        }

        // fail if expected file was not present
        t.test(`${name}.expected.js exists`, t => {
          t.ok(hasExpected)
        })

        const expected = await fsa.readFile(expectedFilename, 'utf8')

        t.test('content is as expected', t => {
          t.equal(actual, expected)
        })
      })
    }

    files
      .map(file => inputRe.exec(file))
      .filter(Boolean)
      .forEach(runSample)
  })
}
