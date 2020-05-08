require('dotenv').config()
const { existsSync, readFileSync } = require('fs')
const { resolve } = require('path')
const defaultConf = require('../../config.defaults.json')

function getConfig() {
    const path = resolve(process.cwd(), 'routify.config.js');

    return {
        ...defaultConf,
        ...getLegacyConfig(),
        ...getPackageConfig(),
        ...getUserConfig(path),
        ...getEnvConfig()
    }
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

function getLegacyConfig() {
    for ([path, parser] of [
        ['config/default.json5', require('json5')],
        ['config/default.yaml', require('yaml')],
        ['config/default.yml', require('yaml')]]) {
        const fullpath = resolve(process.cwd(), path)
        if (existsSync(fullpath)) return parser.parse(readFileSync(fullpath, 'utf8'))
    }
    return {}
}

function getPackageConfig() {
    const path = resolve(process.cwd(), 'package.json')
    return existsSync(path) ?  require(path).routify || {} : {}
}

function normalizeConfig(options) {
    const { extensions, pages } = options
    return {
        ...options,
        extensions: Array.isArray(extensions) ? extensions : extensions.split(','),
        pages: path.resolve(pages).replace(/\\/g, '/'),
        started: new Date().toISOString()
    }
}

module.exports = { getConfig, normalizeConfig }