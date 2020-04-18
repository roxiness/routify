const fs = require('fs');

module.exports.routify = require('../plugins/rollup')
module.exports.getConfig = require('./utils/getConfig').default

let config = {}
try { config = require(`${__dirname}/../tmp/config`) }
catch (err) { }

module.exports.config = config