
const log = require('../../../lib/utils/log')
const chalk = require('chalk')
const path = require('path')
const fse = require('fs-extra')

async function getBranch(cwd) {
    return require('child_process').execSync('git rev-parse --abbrev-ref HEAD', { cwd }).toString().replace(/\n/, '')
}

function exec(command, options = {}) {
    options.stdio = 'inherit'
    log.info(`${chalk.yellow(command)} in ${chalk.green(path.resolve(options.cwd))}`)
    return require('child_process').execSync(command, options)
}
function spawn(command, params, options) {
    log.info(`${chalk.yellow(command, params)} in ${chalk.green(path.resolve(options.cwd))}`)
    return require('child_process').execFile(command, params, options)    
}

/** @type {fse} */
let fs = new Proxy(fse, {
    get(target, name, receiver){
        return function(...args){
            log(chalk.yellow(name), chalk.green(args))
            return target[name](...args)
        }
    }
})

module.exports = { getBranch, exec, spawn, log, fs }