#!/usr/bin/env node
import { RoutifyBuildtime } from '../buildtime/RoutifyBuildtime.js'
import { createDirname } from '../buildtime/utils.js'
import { program } from 'commander'
import { existsSync } from 'fs'
import prompts from 'prompts'
import fse from 'fs-extra'
import { join } from 'path'
import kleur from 'kleur'

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
    .action(async (dir, options) => {
        const points = [
            kleur
                .bold()
                .red('\n! R3 is under heavy work, expect bugs and missing features'),

            kleur.bold().magenta('\nWelcome to Routify 3!'),

            '- Follow our twitter to get updates: ' +
                kleur.blue('https://twitter.com/routifyjs'),

            '- Or join our discord: ' + kleur.blue('https://discord.com/invite/ntKJD5B'),
        ]

        for (const p of points) console.log(p)

        const relativeDirname = createDirname(import.meta)
        const starterPath = join(relativeDirname, '../../examples', options.starter)

        if (existsSync(dir)) {
            console.log('')

            const cancel = () => {
                console.log(kleur.bold().red('\nCancelling...'))
                process.exit(1)
            }

            const { confirm } = await prompts(
                {
                    type: 'confirm',
                    message: `The directory "${dir}" already exists, you sure you want to overwrite it?`,
                    name: 'confirm',
                },
                {
                    onCancel: cancel,
                },
            )

            if (!confirm) cancel()
        }

        fse.copySync(starterPath, dir)

        console.log(
            kleur.green(`\nYour starter app has been made in ${kleur.bold(dir)}!`),
        )
    })

program.parse()
