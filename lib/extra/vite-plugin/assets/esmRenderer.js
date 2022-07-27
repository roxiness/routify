import { readFileSync } from 'fs'
import app, { load } from './App.js'
import { URL } from 'url'

const template = readFileSync(new URL('./index.html', import.meta.url), 'utf-8')

export const render = async (path = '/') => {
    await load(path)
    const render = app.render()
    const html = template
        .replace('<!--ssr:html-->', render.html)
        .replace('<!--ssr:head-->', render.head)
        .replace('<!--ssr:css-->', render.css.code)
    return html
}

const path = process.argv[2]
if (path) render(path).then(html => console.log(html))
