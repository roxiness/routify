const { configent } = require('configent')
const defaults = require('../../config.defaults.json')

module.exports = input => {
    const { extensions, ...options } = configent('routify', defaults, input)
    return {
        ...options,
        extensions: Array.isArray(extensions) ? extensions : extensions.split(','),
        started: new Date().toISOString()
    }
}