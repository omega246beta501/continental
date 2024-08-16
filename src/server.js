import WebSocket, { WebSocketServer } from 'ws'
import { Game } from './game.js'

const wss = new WebSocketServer({ port: 8080 })

let clients = []
const game = new Game()

let turnMessages = []
let gameMessages = []
let hasGameStarted = false

wss.on('connection', (ws) => {
    function sendToAll(message) {
        clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message))
            }
        })
    }

    function sendToAllButSender(message) {
        clients.forEach((client) => {
            if (client != ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message))
            }
        })
    }

    function enviar(message) {
        ws.send(JSON.stringify(message))
    }

    function storeMessage(message) {
        turnMessages.push(message)
        gameMessages.push(message)
        sendToAll({
            key: 'logMessages',
            value: { turnMessages: turnMessages, gameMessages: gameMessages }
        })
    }

    function updateGame() {
        sendToAll({ key: 'gameUpdated', value: game })
        sendToAll({
            key: 'logMessages',
            value: { turnMessages: turnMessages, gameMessages: gameMessages }
        })
    }

    clients.push(ws)

    ws.on('message', (message) => {
        // console.log('received: %s', message)

        const jsonMessage = JSON.parse(message)
        const key = jsonMessage.key
        const value = jsonMessage.value

        if (key == 'addPlayer') {
            if (!hasGameStarted) {
                game.addPlayer(value)
                console.log('Jugadores')
                game.players.forEach((player) => {
                    console.log('Jugador: ' + player.name)
                })
            }
        }

        if (key == 'startGame') {
            console.log('Empieza el juego')
            game.startGame()
            hasGameStarted = true

            let startGameObject = {
                key: 'startGame',
                value: game
            }

            sendToAll(startGameObject)
        }

        if (key == 'updateGame') {
            if (hasGameStarted) {
                enviar({ key: 'gameUpdated', value: game })
                enviar({
                    key: 'logMessages',
                    value: { turnMessages: turnMessages, gameMessages: gameMessages }
                })
            } else {
                enviar({ key: 'gameUpdated', value: false })
            }
        }

        if (key == 'playerDrawedCard') {
            game.copy(jsonMessage.game)
            const message = `${value} ha robado una carta`

            storeMessage(message)
        }

        if (key == 'playerDrawedDiscard') {
            game.copy(jsonMessage.game)
            const cardPlayed = game.players[game.currentPlayerIndex].hand.at(-1).getCardString()
            const message = `${value} ha robado la carta ${cardPlayed} de la pila de descartes`

            storeMessage(message)
            updateGame()
            // sendToAllButSender({ key: 'gameUpdated', value: game })
        }

        if (key == 'playerDiscartedCard') {
            game.copy(jsonMessage.game)
            const cardDiscarted = game.discardPile.at(-1).getCardString()
            const message = `${value} ha descartado la carta ${cardDiscarted}`

            storeMessage(message)
            updateGame()
            // sendToAllButSender({ key: 'gameUpdated', value: game })
            const player = game.currentPlayer

            if (game.endTurn(player.index)) {
                storeMessage(`${value} ha terminado su turno`)

                if (game.endRound(player.index)) {
                    storeMessage(`${value} ha cerrado`)
                    sendToAll({ key: 'roundEnded', value: player.index })
                } else {
                    sendToAll({ key: 'turnEnded', value: game.currentPlayer.name })
                }

                turnMessages = []
                updateGame()
                // sendToAll({ key: 'gameUpdated', value: game })
            }
        }

        if (key == 'playerWentDown') {
            game.copy(jsonMessage.game)
            const message = `${value} se ha bajado`
            storeMessage(message)
            updateGame()
        }

        if (key == 'playerMetioCard') {
            game.copy(jsonMessage.game)
            const message = `${value} ha metido una carta`
            storeMessage(message)
            updateGame()
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
