#!/usr/bin/env node

const program = require('commander')
const fs = require('fs')
const { execSync } = require('child_process')
const { start } = require('../lib/services/interface')
const { exporter, defaultOptions: exporterDefaults } = require('../lib/services/exporter')
const mainDefaults = require('../lib/services/interface').defaultOptions
const log = require('../lib/services/log')

let isCommand = false
program
  .option('-d, --debug', 'extra debugging')
  .option('-p, --pages <location>', 'path/to/pages', mainDefaults.pages)
  .option(
    '-i, --ignore <list>',
    'Files and dirs. Can be string or array. Interpreted as regular expression', mainDefaults.ignore
  )
  .option(
    '-u, --unused-prop-warnings', 'Show warnings about unused props passed by filerouter', mainDefaults.unknownPropWarnings) //todo, replace unknownPropWarnings
  .option(
    '-D, --dynamic-imports', 'Code splitting)', mainDefaults.dynamicImports
  )
  .option('-b, --single-build', "Don't watch for file changes", mainDefaults.singleBuild)
  .option('-s, --scroll [behavior]', "Scroll behavior", mainDefaults.scroll)
  .option('-e, --extensions <names>', "Comma separated extensions", mainDefaults.extensions)


program
  .command('init')
  .action(() => {
    isCommand = true
    fs.readdir('./', (err, files) => {
      if (err) log(err)
      else if (files.length) log('Can only init in an empty directory.')
      else {
        log('Fetching template')
        execSync('npx degit https://github.com/sveltech/routify-starter')
        log('Installing dependencies')
        execSync('npm i')
        execSync('npm run dev', { stdio: 'inherit' })
      }
    })
  })

program
  .command('export')
  .option('-o --output <path>', 'Output folder', exporterDefaults.output)
  .option('-r --routes <path>', 'Routes path', exporterDefaults.routes)
  .option('-s --source <path>', 'Source folder', exporterDefaults.source)
  .option('-b --baseurl <path>', 'Baseurl', exporterDefaults.baseurl)
  .option('-p --no-prerender', 'Don\'t prerender static pages', exporterDefaults.noPrerender)
  .option('-c --server-script <name>', 'Server script', exporterDefaults.serverScript)
  .action(options => {
    isCommand = true
    exporter(options)
  })

program.parse(process.argv)
if (!isCommand) {

  start(program)
}