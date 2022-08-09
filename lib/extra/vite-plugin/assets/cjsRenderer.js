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
const { render: _render } = require('./render.js')

//
const template = readFileSync(__dirname + '/index.html', 'utf8')

/**
 * Renders a given path to HTML
 * @param {string} path
 * @returns {Promise<string>}
 */
const render = async (path = '/') => {
    const output = await _render(path)

    const html = template
        .replace('<!--ssr:html-->', output.html)
        .replace('<!--ssr:head-->', output.head)
        .replace('<!--ssr:css-->', '<style>' + output.css.code + '</style>')
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
