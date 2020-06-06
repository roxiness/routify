import { test } from '..'
import { Volume } from 'memfs'
import * as path from 'path'
import * as fs from 'fs'
import rewiremock from 'rewiremock'

import fsa from '../../lib/utils/fsa'

const resolveSample = (...names) => path.resolve(__dirname, 'build', ...names)

const files = fs.readdirSync(resolveSample())

const inputRe = /^(.+)\.input\.js$/

const runSample = async (t, file, name) => {
  const { default: spec } = await import(resolveSample(file))

  const vol = Volume.fromJSON(spec.files)

  const defaultOptions = {
    extensions: 'svelte',
  }

  const { Builder } = rewiremock.proxy('../../lib/services/interface', {
    '../utils/fsa': fsa.from(vol),
  })

  const build = Builder(
    {
      ...defaultOptions,
      ...spec.options,
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
  t.ok(hasExpected, `${name}.expected.js exists`)

  const expected = await fsa.readFile(expectedFilename, 'utf8')

  const stripTimestamp = code =>
    code
      .replace(/File generated.*/, 'File generated __TIMESTAMP__')
      .replace(/(@sveltech\/routify)[\s.\d-]*/, '$1 __VERSION__')

  t.eq(
    stripTimestamp(actual),
    stripTimestamp(expected),
    'content is as expected'
  )
}

runSample.title = (title, file, name) => title || name

files
  .map(file => inputRe.exec(file))
  .filter(Boolean)
  .forEach(([file, name]) => {
    test(runSample, file, name)
  })
