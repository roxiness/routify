const { fs } = require('./shared')
const path = require('path')

function purger({projectDir, buildsDir}){
    fs.rmdirSync(path.resolve(projectDir, 'node_modules'), {recursive: true})
    fs.emptyDirSync(buildsDir)
}

module.exports = purger