const fs = require('fs-extra')

// Copy the public folder to netlify's working folder
fs.removeSync('public')
fs.copySync('../../dist', 'public')

// For SSR we need to copy the template and bundle to our SSR function
const bundle = {
    date: new Date,
    script: fs.readFileSync('public/build/bundle.js', 'utf8'),
    template: fs.readFileSync('public/__app.html', 'utf8')
}
fs.writeFileSync('api/ssr/bundle.json', JSON.stringify(bundle, 0, 2))