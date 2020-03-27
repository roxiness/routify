const fs = require('fs');

module.exports.routify = require('../plugins/rollup')
module.exports.getConfig = require('./utils/getConfig').default

try {
    module.exports.config = JSON.parse(fs.readFileSync(__dirname + '/../tmp/config.json', 'utf8'))
} catch (err) {
    module.exports.config = { dynamicImports: false }
}