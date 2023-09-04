import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { metaFromFile } from '../../../../buildtime/plugins/metaFromFile/metaFromFile.js'
import { filemapper } from '../../../../buildtime/plugins/filemapper/lib/index.js'
import { RoutifyBuildtime } from '../../../../buildtime/RoutifyBuildtime.js'
import { metaCapturePlugin } from '../index.js'
import { readFile } from 'fs/promises'

const __dirname = dirname(fileURLToPath(import.meta.url))

const options = {
    routifyDir: `${__dirname}/temp`,
    routesDir: { default: `${__dirname}/example` },
}

describe('metaCapture middleware', async () => {
    const instance = new RoutifyBuildtime(options)
    await filemapper({ instance })
    await metaFromFile({ instance })
    await metaCapturePlugin.build({ instance, tools: null })
    test('capture', async () => {
        const captureSvelte = instance.nodeIndex.find(node => node.name === 'capture')
        assert.equal(
            captureSvelte.meta.captures.file,
            await readFile(captureSvelte.file.path, 'utf-8'),
        )
    })
    test('captureSegments', async () => {
        const captureSegmentsSvelte = instance.nodeIndex.find(
            node => node.name === 'captureSegments',
        )
        assert.equal(
            captureSegmentsSvelte.meta.captures.intro,
            '\n' +
                '        <p>\n' +
                '            As we navigate through the intricate world of software development, especially\n' +
                '            in the realms of JavaScript and JSDoc, it is not uncommon to encounter a range\n' +
                '            of logical fallacies...\n' +
                '        </p>\n' +
                '        ',
        )

        assert.equal(
            captureSegmentsSvelte.meta.captures.strawman,
            '\n' +
                '        <h2>Straw Man Fallacy in Development Debates</h2>\n' +
                '        <p>\n' +
                '            An overview of how the straw man fallacy can sometimes divert a meaningful\n' +
                '            discussion and ways to stay focused on the real issues.\n' +
                '        </p>\n' +
                '        ',
        )
    })
})
