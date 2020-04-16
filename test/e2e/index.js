const program = require('commander')
const path = require('path')

const setup = require('./helpers/setup')
const projectDir = path.resolve(__dirname, '../..')
const buildsDir = path.resolve(__dirname, 'builds')


program
    .command('setup')
    .option('-p --purge', 'purge existing builds and dependencies', false)
    .option('-b --branch [branch]', 'branch to use', "")
    .action(async program => {
        const { purge, branch } = program.opts()        
        setup({projectDir, buildsDir, purge, branch})
    })

program.parse(process.argv)
