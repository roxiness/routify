const express = require('express')
const app = express()
const cors = require('cors')
app.use(require('body-parser').json());
app.use(cors())
const port = 5432


app.get('/generic', (req, res) => {
    const delay = req.headers['x-delay'] || 0
    const statusCode = req.headers['x-status-code']
    if (statusCode) res.status(statusCode)
    setTimeout(() => {
        res.send({
            date: Date.now().toString(),
            ...req.query
        })
    }, delay);
})

app.get('/date', (req, res) => {
    const delay = req.headers['x-delay'] || 0
    const statusCode = req.headers['x-status-code']
    if (statusCode) res.status(statusCode)
    setTimeout(() => { res.send(Date.now().toString()) }, delay);
})

app.get('/echo', (req, res) => {
    const delay = req.headers['x-delay'] || 0
    const statusCode = req.headers['x-status-code']
    if (statusCode) res.status(statusCode)
    setTimeout(() => { res.send(req.query.message) }, delay);
})

app.post('/echo', (req, res) => {
    const delay = req.headers['x-delay'] || 0
    const statusCode = req.headers['x-status-code']
    if (statusCode) res.status(statusCode)
    setTimeout(() => { res.send(req.body) }, delay);
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.listen(port, () => console.log(`Mock server API listening at http://localhost:${port}`))