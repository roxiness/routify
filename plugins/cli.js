#!/usr/bin/env node

const program = require('commander')
const fs = require('fs')
const { execSync } = require('child_process')
const { start } = require('../lib/services/interface')
const { exporter, defaultOptions } = require('../lib/services/exporter')
const log = require('../lib/services/log')


let isCommand = false
program
  .option('-d, --debug', 'extra debugging')
  .option('-p, --pages <location>', 'path/to/pages (Defaults to ./src/pages)')
  .option(
    '-i, --ignore <list>',
    '["widget.svelte"] (Files and dirs. Can be string or array. Interpreted as regular expression)'
  )
  .option(
    '-u, --unused-prop-warnings',
    'Show warnings about unused props passed by filerouter'
  ) //todo, replace unknownPropWarnings
  .option(
    '-D, --dynamic-imports',
    'Experimental code splitting. Defaults to false.)'
  )
  .option('-b, --single-build', "Don't watch for file changes") //todo
  .option('-s, --scroll [behavior]', "Scroll behavior", false)  

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
  .option('-o --output [path]', 'Output folder', defaultOptions.output)
  .option('-r --routes [path]', 'Routes path', defaultOptions.routes)
  .option('-s --source [path]', 'Source folder', defaultOptions.source)
  .option('-b --baseurl [path]', 'Baseurl', defaultOptions.baseurl)
  .option('-c --server-script [name]', 'Server script', defaultOptions.serverScript)
  .action(options => {
    isCommand = true
    exporter(options)
  })

program.parse(process.argv)

if (!isCommand) {

  start(program)
}
