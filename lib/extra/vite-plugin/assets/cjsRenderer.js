const { readFileSync } = require('fs')
const app = require('./App.js')

const template = readFileSync(__dirname + '/index.html', 'utf8')

const render = async (path = '/') => {
    await app.load(path)
    const render = app.default.render()
    const html = template
        .replace('<!--ssr:html-->', render.html)
        .replace('<!--ssr:head-->', render.head)
        .replace('<!--ssr:css-->', render.css.code)
    return html
}

const path = process.argv[2]
if (path) render(path).then(html => console.log(html))

module.exports = { render }
