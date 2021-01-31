#!/usr/bin/env node

const { Command } = require('commander')
const program = new Command()
const defaults = require('../lib/utils/config')()
const stdio = 'inherit'

program
  .command('run', { isDefault: true })
  .option('-d, --debug', 'extra debugging')
  .option('-p, --pages <location>', 'path/to/pages', defaults.pages)
  .option(
    '-i, --ignore <list>',
    'Blob of files and dirs to be ignored', defaults.ignore
  )
  .option(
    '-D, --no-dynamic-imports', 'Code splitting)', defaults.dynamicImports
  )
  .option('-b, --single-build', "Don't watch for file changes", defaults.singleBuild)
  .option('-e, --extensions <names>', "Included file extensions (comma separated)", defaults.extensions)
  .option('-c, --child-process <command>', "Run npm task when Routify is ready", defaults.childProcess)
  .option('-r, --routify-dir <dir>', "Output folder for routify temp files", defaults.routifyDir)
  .option('    --no-hash-scroll', "Disable automatic scroll to hash", defaults.noHashScroll)
  .action((routify, options) => {
    // Let's write an empty template before we do anything else, to help us avoid race conditions with bundlers and servers.    
    require('fs-extra').outputFileSync(`${routify.routifyDir}/routes.js`, 'export * from "@roxi/routify/runtime/defaultTmp/routes"', 'utf-8')

    // we don't want commander to ignore the defalut value
    routify.dynamicImports = routify.dynamicImports && defaults.dynamicImports

    require('../lib/services/interface').start(routify)
  })


program
  .command('init')
  .option('-s, --start-dev', 'run "npm run dev" after install', false)
  .option('-e, --no-example', 'delete the example folder')
  .option('-n, --no-install', 'don\'t auto install npm modules')
  .option('-b, --branch [name]', 'branch to checkout (can also be commit hash or release tag)', 'master')

  .action(init => {
    const fs = require('fs-extra')
    const log = require('../lib/utils/log')
    const { execSync } = require('child_process')
    const { example, startDev, branch, install } = init
    fs.readdir('./', (err, files) => {
      if (err) log(err)
      else if (files.length) log('Can only init in an empty directory.')
      else {
        log('Fetching template')
        execSync(`npx degit https://github.com/roxiness/routify-starter#${branch}`)

        if (install) {
          log('Installing dependencies')
          execSync('npm i --loglevel=error')
        }

        if (!example) {
          fs.remove('./src/pages/example')
          fs.remove('./src/pages/index.svelte')
        }
        if (startDev) execSync('npm run dev', { stdio })
        else log('Run "npm run dev" to start the server.')
      }
    })
  })

program
  .command('export')
  .option('    --dist-dir <path>', 'Dist folder', defaults.distDir)
  .option('-r, --routify-dir <path>', 'Routify dir', defaults.routifyDir)
  .option('i,   --convert-to-index', 'Output foo.svelte to /foo/index.html', defaults.convertToIndex)
  // todo implement default basepath - avoid extra iteration
  .option('   --basepath <path>', 'Comma separated basepaths to use for exports', defaults.basepath)
  .action(options => {
    const { exporter } = require('../lib/services/exporter')
    exporter(options)
  })


program.parse(process.argv)
