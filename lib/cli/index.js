#!/usr/bin/env node
import { RoutifyBuildtime } from '#lib/buildtime/RoutifyBuildtime.js'
import { program } from 'commander'

program
    .command('build', { isDefault: true })
    .description('build routes')
    .option('-w --watch', 'rebuild routes on changes')
    .option('-r --routifyDir <path>', 'output folder for routify temp files')
    .option('-e --extentions <ext>', 'file extensions to build, comma separated.')
    .option('   --noDynamicImports', 'disable code splitting of pages')
    .option('   --ignore <glob>', 'files to ignore')
    .action(options => {
        const routify = new RoutifyBuildtime(options)
        routify.start()
    })

program.parse()
