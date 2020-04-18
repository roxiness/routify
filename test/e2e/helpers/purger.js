const { fs } = require('./shared')
const path = require('path')

function purger({projectDir, buildsDir}){
    // todo are we cutting the branch we're sitting on?
    // fs.rmdirSync(path.resolve(projectDir, 'node_modules'), {recursive: true})
    fs.emptyDirSync(buildsDir)
}

module.exports = purger