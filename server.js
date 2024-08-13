// server.js
// const WebSocket = require('ws');
import WebSocket, { WebSocketServer } from 'ws';
import { Prueba } from './prueba.js';

const wss = new WebSocketServer({ port: 8080 });

let clients = [];
let prueba = new Prueba('Antonio');

wss.on('connection', (ws) => {
  clients.push(ws);

  ws.on('message', (message) => {
    prueba.num++;
    console.log(prueba);
    console.log('received: %s', message);
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        // client.send(message);
        client.send(JSON.stringify(prueba));
      }
    });
  });

  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
  });
});

console.log('WebSocket server running on ws://localhost:8080');
