#!/usr/bin/env node

const program = require('commander')
const fs = require('fs')
const { execSync } = require('child_process')
const { start } = require('../lib/services/interface')

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
  .option('-b, --single-build', "Don't watch for new route files") //todo
  .option('-s, --scroll [behavior]', "Scroll behavior.", "auto") 
  .command('init')
  .action(() => {
    isCommand = true
    fs.readdir('./', (err, files) => {
      if (err) console.log(err)
      else if (files.length) console.log('Can only init in an empty directory.')
      else {
        console.log('Fetching template')
        execSync('npx degit https://github.com/sveltech/routify-starter')
        console.log('Installing dependencies')
        execSync('npm i')
        execSync('npm run dev', { stdio: 'inherit' })
      }
    })
  })

program.parse(process.argv)

if (!isCommand) start(program)
