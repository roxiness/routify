require('dotenv').config()
const { existsSync, readFileSync } = require('fs')
const { resolve } = require('path')
const defaultConf = require('../../config.defaults.json')

function getConfig(input) {
    const path = resolve(process.cwd(), 'routify.config.js');

    const config = {
        ...defaultConf,
        ...getPackageConfig(),
        ...getUserConfig(path),
        ...getEnvConfig(),
        ...input
    }
    
    return normalizeConfig(config)
}

function getEnvConfig() {
    const entries = Object.entries(process.env)
        .filter(([key]) => key.match(/^ROUTIFY_/))
        .map(parseField)

    return entries.length ? entries.reduce((prev = {}, { key, value }) => ({ ...prev, [key]: value })) : {}

    function parseField([key, value]) {
        const toCamel = s => s.toLowerCase().replace(/[-_][a-z]/g, s => s.substr(1).toUpperCase());
        const shouldParseValue = k => !['string', 'undefined'].includes(typeof defaultConf[k])

        key = toCamel(key.replace(/^ROUTIFY_/, ''))
        value = shouldParseValue(key) ? JSON.parse(value) : value
        return { key, value }
    }
}

function getUserConfig(path) {
    return existsSync(path) ? require(path) : {}
}

function getPackageConfig() {
    const path = resolve(process.cwd(), 'package.json')
    return existsSync(path) ?  require(path).routify || {} : {}
}

function normalizeConfig(options) {
    const { extensions } = options
    return {
        ...options,
        extensions: Array.isArray(extensions) ? extensions : extensions.split(','),
        started: new Date().toISOString()
    }
}

module.exports = { getConfig }