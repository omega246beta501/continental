import WebSocket, { WebSocketServer } from 'ws'
import { Game } from './game.js'
import { send } from 'vite'

const wss = new WebSocketServer({ port: 8080 })

let clients = []
const game = new Game()

let turnMessages = []
wss.on('connection', (ws) => {

    function sendToAll(message) {
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message))
            }
        });
    }

    function sendToAllButSender(message) {
        clients.forEach(client => {
            if (client != ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message))
            }
        });
    }

    function enviar(message) {
        ws.send(JSON.stringify(message))
    }

    clients.push(ws)

    ws.on('message', (message) => {
        console.log('received: %s', message)

        const jsonMessage = JSON.parse(message)
        const key = jsonMessage.key
        const value = jsonMessage.value

        if(key == 'addPlayer') {
            game.addPlayer(value)
            console.log("Jugadores")
            game.players.forEach(player => {
                console.log("Jugador: " + player.name)
            });
        }

        if (key == 'startGame') {
            console.log('Empieza el juego')
            game.startGame();

            let startGameObject = {
                key: 'startGame',
                value: game,
            }

            sendToAll(startGameObject)
        }

        if (key == 'updateGame') {
            enviar({ key: 'gameUpdated', value: game })
            enviar({ key: 'roundMessages', value: turnMessages })
        }

        if (key == 'playerDrawedCard') {
            turnMessages.push(`Jugador ${value} ha robado una carta`)
            sendToAllButSender({
                key: 'roundMessages',
                value: turnMessages
            })
        }

        // clients.forEach((client) => {
        //     if (client !== ws && client.readyState === WebSocket.OPEN) {
        //         client.send(message)
        //     }
        // })
    })

    ws.on('close', () => {
        clients = clients.filter((client) => client !== ws)
    })
})



console.log('WebSocket server running on ws://localhost:8080')
