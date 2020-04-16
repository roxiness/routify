const { getBranch, exec, spawn, log } = require('./shared')
const path = require('path')

async function run({ branch, buildsDir, projectDir }) {
    branch = branch || await getBranch(projectDir)
    const buildDir = path.resolve(buildsDir, `starter-template#${branch}`)

    exec(`testcafe chrome starter-example.js`
        + ` --app "npm run dev --prefix ${buildDir}"`,
        { cwd: path.resolve(__dirname, '../tests') })
}

module.exports = run