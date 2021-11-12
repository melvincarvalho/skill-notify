#!/usr/bin/env node

import WebSocket from 'ws';

var secret = process.env['SECRET'] || 's'

const ws = new WebSocket('ws://localhost:4444')

ws.on('open', function open() {
  ws.send(`update ${process.argv[2] || 'a'} ${secret}`)
  ws.close()
})

ws.on('message', function incoming(message) {
  console.log('received: %s', message);
});


