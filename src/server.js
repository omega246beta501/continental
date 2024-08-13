// server.js
// const WebSocket = require('ws');
import WebSocket, { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 8080 })

let clients = []

wss.on('connection', (ws) => {
    clients.push(ws)

    ws.on('message', (message) => {
        console.log('received: %s', message)
        clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message)
            }
        })
    })

    ws.on('close', () => {
        clients = clients.filter((client) => client !== ws)
    })
})

console.log('WebSocket server running on ws://localhost:8080')
