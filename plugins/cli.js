#!/usr/bin/env node
// @ts-nocheck

const fs = require('fs')
// Let's write a template before we do anything else, to help us avoid race conditions with bundlers and servers.
fs.writeFileSync(__dirname + '/../tmp/routes.js', 'export * from "../runtime/defaultTmp/routes"', 'utf-8')


const program = require('commander')
const fse = require('fs-extra')
const { execSync } = require('child_process')
const { start } = require('../lib/services/interface')
const { exporter } = require('../lib/services/exporter')
const defaults = require('../config.defaults.json')
const log = require('../lib/utils/log')
const stdio = 'inherit'

program
  .command('run', { isDefault: true })
  .option('-d, --debug', 'extra debugging')
  .option('-p, --pages <location>', 'path/to/pages', defaults.pages)
  .option(
    '-i, --ignore <list>',
    'Files and dirs. Can be string or array. Interpreted as regular expression', defaults.ignore
  )
  .option(
    '-D, --dynamic-imports', 'Code splitting)', defaults.dynamicImports
  )
  .option('-b, --single-build', "Don't watch for file changes", defaults.singleBuild)
  .option('-e, --extensions <names>', "Included file extensions (comma separated)", defaults.extensions)
  .option('-c, --child-process <command>', "Run npm task when Routify is ready", defaults.childProcess)
  .option('    --no-hash-scroll', "Disable automatic scroll to hash", defaults.noHashScroll)
  .action(program => {
    const options = program.opts()
    Object.entries(options).forEach(([key, value]) => {
      if (typeof value === 'undefined') delete options[key]
    })
    start(options)
  })


program
  .command('init')
  .option('-s, --start-dev', 'run "npm run dev" automatically', false)
  .option('-e, --no-example', 'delete the example folder')
  .option('-n, --no-install', 'don\'t auto install npm modules')
  .option('-b, --branch [name]', 'branch to checkout (can also be commit hash or release tag)', 'master')
  
  .action(program => {
    const { example, startDev, branch, linkRoutify, install } = program.opts()
    fs.readdir('./', (err, files) => {
      if (err) log(err)
      else if (files.length) log('Can only init in an empty directory.')
      else {
        log('Fetching template')
        execSync(`npx degit https://github.com/sveltech/routify-starter#${branch}`)

        if (install) {
          log('Installing dependencies')
          execSync('npm i --loglevel=error')
        }

        if (!example) {
          fse.remove('./src/pages/examples')
          fse.remove('./src/pages/index.svelte')
        }
        if (startDev) execSync('npm run dev', { stdio })
        else log('Run "npm run dev" to start the server.')
      }
    })
  })

program
  .command('export')
  .option('-o --output <path>', 'Dist folder', defaults.distDir)
  .option('-r --routes <path>', 'Routify dir', defaults.routifyDir)
  .option('   --basepath <path>', 'Dist folder', defaults.basepath)
  .action(options => exporter(options.opts()))


program.parse(process.argv)
