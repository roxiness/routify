const fs = require('fs');

module.exports.routify = require('../plugins/rollup')

try {
    module.exports.config = JSON.parse(fs.readFileSync(__dirname + '/../tmp/config.json', 'utf8'))
} catch (err) {
    module.exports.config = { dynamicImports: false }
}