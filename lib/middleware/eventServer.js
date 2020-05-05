const http = require('http')

let broadcast = () => { }
let __payload = null
let __buildId = Date.now()



broadcast = createSSEServer()



__payload = payload
__buildId++
broadcast('payload', __payload, __buildId)






function createSSEServer() {
    const clients = []
  
    const server = http.createServer(function (req, res) {
      if (req.url.match('^\/verify')) {
        res.writeHead(200, {
          'Content-Type': 'text/json',
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        });
        const id = req.url.replace(/^\/verify\//, '')
        res.write(JSON.stringify({ verified: id == __buildId, providedId: id, currentId: __buildId }))
        res.end()
      }
      if (req.url === '/stream') {
        clients.push(res)
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Connection': 'keep-alive',
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        });
        send(res, `connected`, 'hello', 0)
        send(res, 'payload', __payload, __buildId)
      }
    })
  
  
    const port = 13975
    const maxTries = 25
    let _port = port
    server.on('error', (err) => {
      if (err.message.match('EADDRINUSE:')) {
        if (_port < port + maxTries) {
          log(`port ${_port} is in use. Trying port ${_port++ + 1}`)
          server.listen(_port);
        }
        else log('Error: could not find an empty port for server events')
      }
    })
    server.listen(_port);
  
  
    function broadcast(eventName, data, id) { clients.forEach(res => send(res, eventName, data, id)) }
  
    function send(res, eventName, data, id) {
      res.write(`event: ${eventName}\nid: ${id}\ndata: ${JSON.stringify(data)}`)
      res.write(`\n\n`)
    }
  
    return broadcast
  }