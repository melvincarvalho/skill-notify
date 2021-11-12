#!/usr/bin/env node

import { WebSocketServer } from 'ws'
import cuid from 'cuid'

export default function WsServer(server, opts) {
  var store = {}
  opts = opts || {}
  const port = opts.port || 4444
  const secret = process.env['SECRET'] || 's'

  const wss = new WebSocketServer({ port: port })
  console.log('new ws started on port', port)

  wss.on('connection', function connection(client) {
    client.cuid = client.cuid || cuid().toString()

    client.on('close', function () {
      console.log('closing')
      Object.keys(store).forEach(key => {
        console.log('key', key)
        if (store[key].indexOf(client) !== -1) {
          store[key] = store[key].splice(store[key].indexOf(client), 1)
          console.log('deleting client')
          console.log(store)
        }
      })

    })

    // console.log('client', client)
    client.on('message', function incoming(message) {
      message = message.toString()
      console.log('received: %s', message)

      console.log('store', store)

      if (message.toString().startsWith('sub ')) {
        const tuple = message.split(' ')
        if (tuple && tuple.length === 2) {
          const uri = tuple[1]
          store[uri] = store[uri] || []
          if (!store[uri].includes(client)) {
            store[uri].push(client)
          }
        }
        // console.log(store)
      }

      if (message.toString().startsWith('update ')) {
        const tuple = message.split(' ')
        if (tuple && tuple.length === 3 && tuple[2] === secret) {
          const uri = tuple[1]

          if (store[uri]) {
            store[uri].map(i => {
              // console.log(i)
              i.send('pub ' + uri)
            })
          }

          client.send('done publishing ' + tuple[1])
        }
      }
    })

    client.send('connected')

    client.on('ping', function () {
      client.pong()
    })
  })
}
