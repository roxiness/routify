#!/usr/bin/env node
import fse from 'fs-extra'
import { program } from 'commander'
import { RoutifyBuildtime } from '../buildtime/RoutifyBuildtime.js'
import { createDirname } from '#lib/buildtime/utils.js'

program
    .command('build', { isDefault: true })
    .description('build routes')
    .option('-w --watch', 'rebuild routes on changes')
    .option('-r --routifyDir <path>', 'output folder for routify temp files')
    .option('-e --extensions <ext>', 'file extensions to build, comma separated.')
    .option('   --noDynamicImports', 'disable code splitting of pages')
    .option('   --ignore <glob>', 'files to ignore')
    .action(options => {
        const routify = new RoutifyBuildtime(options)
        routify.start()
    })

program
    .command('create <dir>')
    .description('create a new Routify app')
    .option('-s --starter <project>', 'starter project from example folder', 'starter')
    .action((dir, options) => {
        const dirname = createDirname(import.meta)
        fse.copySync(dirname + '/../../examples/' + options.starter, dir)
    })

program.parse()
