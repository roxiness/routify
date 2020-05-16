const http = require('http')
const log = require('../utils/log')


module.exports = eventServer

/**
 * @param {*} middlewares
 * @param {TreePayload} payload
 * @returns
 */
function eventServer(middlewares) {
  const index = middlewares.findIndex(middleware => middleware.name === 'initial') + 1

  middlewares.splice(index, 0, {
    name: 'eventServer',
    middleware: attachServer
  })

  middlewares.push({
    name: 'eventEmitter',
    middleware: emitEvent
  })
  return middlewares
}


function attachServer(payload) {
  if (!payload.options.singleBuild) {
    if (!payload.state.eventServer)
      createSSEServer(payload)

  }
}

function emitEvent(payload) {
  if (!payload.options.singleBuild) {
    payload.state.eventServer.buildId++
    const { tree, routes } = payload
    console.log('emitting')
    payload.state.eventServer.broadcast('payload', { tree, routes }, payload.state.eventServer.buildId)
  }
}



function createSSEServer(payload) {
  payload.state.eventServer = {
    clients: [],
    broadcast: null,
    buildId: Date.now()
  }

  const server = http.createServer(function (req, res) {
    const { buildId } = payload.state.eventServer
    const { tree, routes } = payload

    if (req.url.match('^\/verify')) {
      res.writeHead(200, {
        'Content-Type': 'text/json',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
      const id = req.url.replace(/^\/verify\//, '')
      res.write(JSON.stringify({ verified: id == buildId, providedId: id, currentId: buildId }))
      res.end()
    }
    if (req.url === '/stream') {
      payload.state.eventServer.clients.push(res)
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
      send(res, `connected`, 'hello', 0)
      send(res, 'payload', { tree, routes }, buildId)
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
        payload.state.eventServer.port = _port
      }
      else log('Error: could not find an empty port for server events')
    }
  })
  server.listen(_port);
  payload.state.eventServer.port = _port

  payload.state.eventServer.broadcast = function broadcast(eventName, data, id) {
    payload.state.eventServer.clients.forEach(res => send(res, eventName, data, id))
  }

  function send(res, eventName, data, id) {
    res.write(`event: ${eventName}\nid: ${id}\ndata: ${JSON.stringify(data)}`)
    res.write(`\n\n`)
  }
}