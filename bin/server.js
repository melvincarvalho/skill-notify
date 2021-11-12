#!/usr/bin/env node

import WebSocket from 'ws';
import WsServer from '../lib/server.js'

var w = new WsServer()

const ws = new WebSocket('ws://localhost:4444');

ws.on('open', function open() {
  ws.send('sub a');
});


function pub() {
  console.log('sending')
  ws.send('update a s')
}


ws.on('message', function incoming(message) {
  console.log('received: %s', message);
});


setTimeout(pub, 5000)

