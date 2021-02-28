const { configent } = require('configent')
const defaults = require('../../config.defaults.json')


module.exports = input => {
    const configentOptions = { useDetectDefaults: true, name: 'routify', module }
    const { extensions, ...options } = configent(defaults, input, configentOptions)
    return {
        ...options,
        extensions: Array.isArray(extensions) ? extensions : extensions.split(','),
        started: new Date().toISOString()
    }
}