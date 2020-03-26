/* eslint-disable no-console */

const colors = { red: '\x1b[41m', yellow: '\x1b[33m', reset: '\x1b[0m' }

const { name: NAME } = require('../../package.json')
// TODO logs
const logPrefix = `[${NAME.split('/').pop()}]`

const log = console.log.bind(console, logPrefix)

log.warn = console.warn.bind(console, logPrefix)

log.debug = () => {}

// log.debug = console.debug.bind(console, logPrefix)

log.error = (...params) =>
  console.error(colors.red + logPrefix, ...params, colors.reset)

module.exports = log
