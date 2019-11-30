#!/usr/bin/env node

const program = require('commander')
const generateRoutes = require('./watcher').generateRoutes

program
  .option('-c, --cheese <type>', 'add the specified type of cheese', 'blue')
  .option('-s, --small', 'small pizza size')

program
    .option('-d, --debug', 'extra debugging')
    .option('-p, --pages <location>', 'path/to/pages (Defaults to ./src/pages)')
    .option('-i, --ignore <list>', '["widget.svelte"] (Files and dirs. Can be string or array. Interpreted as regular expression)')
    .option('-u, --unknown-prop-warnings', 'Defaults to true. Disable to hide warnings about props passed by filerouter')
    .option('-d, --dynamic-imports', 'Experimental code splitting. Defaults to false.)')

program.parse(process.argv)

generateRoutes(program)
