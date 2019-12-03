#!/usr/bin/env node

const program = require('commander')
const { start } = require('../lib/services/interface')

program
    .option('-d, --debug', 'extra debugging')
    .option('-p, --pages <location>', 'path/to/pages (Defaults to ./src/pages)')
    .option('-i, --ignore <list>', '["widget.svelte"] (Files and dirs. Can be string or array. Interpreted as regular expression)')
    .option('-u, --unused-prop-warnings', 'Show warnings about unused props passed by filerouter') //todo, replace unknownPropWarnings
    .option('-d, --dynamic-imports', 'Experimental code splitting. Defaults to false.)')
    .option('-s, --single-build', 'Don\'t watch for new route files') //todo


program.parse(process.argv)

start(program)
