/**
 * This file handles SSR rendering of pages.
 * It can be imported:
 * @example
 * import { render } from 'path/to/render.js`
 * const html = await render('/post/welcome')
 *
 * Or used as a CLI:
 * @example
 * node serve.js /post/welcome
 */

const { readFileSync } = require('fs')
const app = require('./App.js')

const template = readFileSync(__dirname + '/index.html', 'utf8')

/**
 * Renders a given path to HTML
 * @param {string} path
 * @returns {Promise<string>}
 */
const render = async (path = '/') => {
    await app.load(path)
    const render = app.default.render()
    const html = template
        .replace('<!--ssr:html-->', render.html)
        .replace('<!--ssr:head-->', render.head)
        .replace('<!--ssr:css-->', render.css.code)
    return html
}

/**
 * Allows render to be called from terminal.
 * @example
 * ```cli
 * node serve.js /post/welcome
 * ```
 */
const path = process.argv[2]
if (path) render(path).then(html => console.log(html))

module.exports = { render }
