// import { Builder } from '../../lib/services/interface'
// rewiremock.es6.js
import rewiremock from 'rewiremock'
import { Volume } from 'memfs'
import * as path from 'path'

import fsa from '../../lib/utils/fsa'

export default t => {
  t.only('build', async t => {
    const resolve = (...names) => path.resolve(__dirname, 'build', ...names)

    const files = await fsa.readdir(resolve())

    const inputRe = /^(.+)\.input\.js$/

    for (const file of files) {
      const match = inputRe.exec(file)
      if (!match) continue
      const name = match[1]
      t.only(`build:${name}`, async t => {
        const { default: spec } = await import(resolve(file))

        const vol = Volume.fromJSON(spec.files)

        // const { Builder } = await rewiremock.module(
        //   () => import('../../lib/services/interface'),
        //   { fs: vol }
        // )
        const { Builder } = rewiremock.proxy('../../lib/services/interface', {
          fs: vol,
        })

        const build = Builder(spec.options)

        const actual = await build(true)

        const expectedFilename = resolve(`${name}.expected.js`)
        const hasExpected = await fsa.exists(expectedFilename)
        if (!hasExpected) {
          await fsa.writeFile(expectedFilename, actual, 'utf8')
          return
        }

        t.ok(hasExpected, `${name}.expected.js exists`)

        const expected = await fsa.readFile(expectedFilename, 'utf8')

        t.equal(actual, expected)
      })
    }

    // const vol = Volume.fromJSON({
    //   '/pages/index.svelte': 'index',
    //   '/pages/foo.svelte': 'foo',
    //   '/pages/bar/index.svelte': 'bar',
    // })
    //
    // // const { Builder } = rewiremock.proxy('../../lib/services/interface', {
    // const { Builder } = await rewiremock.module(
    //   () => import('../../lib/services/interface'),
    //   { fs: vol }
    // )
    //
    // t.test('Builder is a factory', t => {
    //   t.ok(typeof Builder, 'function')
    // })
    //
    // const build = Builder({
    //   pages: '/pages',
    // })
    //
    // t.only('build', t => {
    //   t.test('is a function', t => {
    //     t.is(typeof build, 'function')
    //   })
    //
    //   t.only('uses mocked fsa', async t => {
    //     const routes = await build(true)
    //     console.log(routes)
    //     // process.exit()
    //   })
    // })
  })
}
