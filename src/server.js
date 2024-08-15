import WebSocket, { WebSocketServer } from 'ws'
import { Game } from './game.js'
import { send } from 'vite'

const wss = new WebSocketServer({ port: 8080 })

let clients = []
const game = new Game()

let turnMessages = []
let roundMessages = []

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

    function storeMessage(message) {
        turnMessages.push(message)
        roundMessages.push(message)
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
            game.copy(jsonMessage.game)
            const message = `${value} ha robado una carta`

            storeMessage(message)
            sendToAllButSender({
                key: 'roundMessages',
                value: turnMessages
            })
        }

        if (key == 'playerDrawedDiscard') {
            game.copy(jsonMessage.game)
            const cardPlayed = game.players[game.currentPlayerIndex].hand.at(-1).getCardString()
            const message = `${value} ha robado la carta ${cardPlayed} de la pila de descartes`
            storeMessage(message)

            sendToAllButSender({ key: 'gameUpdated', value: game })
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
