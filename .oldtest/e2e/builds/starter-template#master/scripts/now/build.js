const fs = require('fs-extra')
const { execSync } = require('child_process');

if (!fs.pathExistsSync('../../dist')) {
    console.log('Building app...')
    execSync('npm run build:app', {stdio: 'inherit'})
}

fs.removeSync('public')
fs.copySync('../../dist', 'public')