const { getBranch, exec, log } = require('./shared')
const path = require('path')

async function run({ branch, buildsDir, projectDir, args, app }) {
    branch = branch || await getBranch(projectDir)
    const buildDir = path.resolve(buildsDir, `starter-template#${branch}`)

    app = app ? `--app "${app.replace('__buildDir__', buildDir)}"` : ''

    const argsStr = args.join(' ')
     exec(`testcafe chrome starter-example.js ${app} ${argsStr}`,
         { cwd: path.resolve(__dirname, '../tests') })
}

module.exports = run