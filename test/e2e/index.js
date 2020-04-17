const program = require('commander')
const path = require('path')

const setup = require('./helpers/setup')
const run = require('./helpers/run')
const projectDir = path.resolve(__dirname, '../..')
const buildsDir = path.resolve(__dirname, 'builds')
console.log('hello')

program
    .command('setup')
    .option('-p --purge', 'purge existing builds and dependencies', false)
    .option('-b --branch [branch]', 'branch to use', "")
    .action(async program => {
        const { purge, branch } = program.opts()
        setup({ projectDir, buildsDir, purge, branch })
    }).parseOptions(process.argv)

program.command('test')
    .option('-b --branch [branch]', 'branch to use', "")
    .option('-a --app [command]', 'app to start', "")
    .allowUnknownOption()
    .action(async _program => {
        const { branch, app, } = _program.opts()
        const { args } = _program        
        run({ branch, app, buildsDir, projectDir, args })
    })
    .parseOptions(process.argv)


program.parse(process.argv)