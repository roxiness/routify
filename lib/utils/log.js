/* eslint-disable no-console */
const chalk = require('chalk')
const ls = require('log-symbols')

/** @type {{prefix?:string, reset?:string}} */
const defaults = { prefix: '[Routify]' }

const log = logFactory({ prefix: '[Routify]' })
log['testing'] = logFactory({ prefix: '🥼 [Routify]' })



/**
 * 
 * @param {defaults} options 
 */
function logFactory(options) {
  const { prefix } = { ...defaults, ...options }
  const log = console.log.bind(console, prefix)
  log.debug = process.env.DEBUG ? log : ()=>{}
  log.title = input => console.log(getTitle(input, prefix + ' ', 50, true))
  log.info = (...args) => console.info(prefix, ls.info, ...args)
  log.warn = (...args) => console.warn(prefix, ls.warning, ...args)
  log.error = (...args) => console.error(prefix, ls.error, ...args)
  log.action = (...args) => console.log(prefix, chalk.blueBright('⚙ '), ...args)
  log.success = (...args) => console.log(prefix, ls.success, ...args)
  return log
}

function getTitle(string, prefix, minLength = 0, center) {
  const length = Math.max(string.length, minLength)
  const hr = new Array(length + 1).join('-')
  const padding = center ? new Array(Math.floor((minLength - string.length) / 2)).join(' ') : ''
  return `${prefix + hr}\n${prefix + padding + string}\n${prefix + hr}`
}

module.exports = log




