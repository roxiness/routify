import express from 'express'

async function createServer() {
    const app = express()

    // example endpoint
    app.get('/api/greeting', (req, res) => {
        // Please note: this is not a production-ready way to handle CORS
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.json({ msg: 'Hello World' })
    })

    app.listen(3000)
    console.log('listening on http://localhost:3000')
}

createServer()
