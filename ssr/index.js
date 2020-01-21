const express = require('express')
const renderURL = require('./renderURL.js');
const { resolve } = require('path')

const defaultOptions = {
    path: 'dist',
    entry: 'dist/__app.html',
    port: '3005'
}

module.exports = function (userOptions = {}) {
    const options = { ...defaultOptions, ...userOptions }
    const sub = express.Router()
    createSPA(options)
    sub.use(express.static(options.path))


    sub.get('*', async function (req, res) {

        const url = `${req.protocol}://localhost:${options.port}${req.url}`
        const { html, ttRenderMs } = await renderURL(url);

        res.set('Server-Timing', `Prerender;dur=${ttRenderMs};desc="Headless render time (ms)"`);
        const ssrNote = '\n<!-- prerendered -->'
        return res.status(200).send(html + ssrNote); // Serve prerendered page as response.
    })

    return sub
}


/**
 * Create SPA
 *
 * @param {object} { path, entry, port }
 */
function createSPA({ path, entry, port }) {
    const spa = express()
    spa.use(express.static(path))

    spa.get('*', function (request, response) {
        const file = resolve(process.cwd(), entry)
        response.sendFile(file);
    });

    spa.listen(port);
}