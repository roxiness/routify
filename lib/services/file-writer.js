const path = require('path')
const fsa = require('../utils/fsa')
const log = require('./log')

module.exports = function fileWriter(content, options, event) {
    const { outputFile } = options
    const filenamePromise = resolveOutputFile(outputFile)

    const generate = async event => {
        if (event) {
            log(`Generate routes (changed: ${event.path})`)
        } else {
            log('Generate routes')
        }
        const filename = await filenamePromise
        await fsa.mkdir(path.dirname(filename), { recursive: true })
        await fsa.writeFile(filename, content, 'utf8')
        log.debug('Written', filename)
    }

    return generate()
}

const resolveOutputFile = async input => {
    const value = typeof input === 'function' ? await input() : input
    return path.resolve(value)
}