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

import { readFileSync } from 'fs'
import { render as _render } from './render.js'
import { URL } from 'url'

const template = readFileSync(new URL('./index.html', import.meta.url), 'utf-8')

/**
 * Renders a given path to HTML
 * @param {string} path
 * @returns {Promise<{html: string, load: any}>}
 */
export const render = async (path = '/') => {
    const output = await _render(path)

    const html = template
        .replace('<!--ssr:html-->', output.html)
        .replace('<!--ssr:head-->', output.head)
        .replace('<!--ssr:css-->', '<style>' + output.css.code + '</style>')
    return { ...output, html }
}

/**
 * Allows render to be called from terminal.
 * @example
 * ```cli
 * node serve.js /post/welcome
 * ```
 */
if (process.argv.includes('render')) {
    const url = process.argv[process.argv.indexOf('render') + 1] || '/'
    render(url).then(o => console.log(o.html))
}
