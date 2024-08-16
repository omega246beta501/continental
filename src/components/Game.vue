<template>
    <div id="game">
        <div class="row">
            <div class="col">
                <h1>Continental</h1>
                <h2 v-if="!isMyTurn">Turno de {{ game.currentPlayer.name }}</h2>
                <h2 v-if="isMyTurn">Es tu turno</h2>

                <div v-show="!isMyTurn">
                    <h3 v-for="(roundMessage, index) in turnMessages">{{ roundMessage }}</h3>
                </div>
            </div>
        </div>
        <div class="row">
            <div id="controls" class="col">
                <button
                    class="game-button"
                    @click="drawCard"
                    v-show="!hasDrawn && game.currentPlayer.name == thisPlayer.name"
                >
                    Robar carta
                </button>
                <button
                    class="game-button"
                    @click="goDown"
                    v-show="!thisPlayer.isDown && game.currentPlayer.name == thisPlayer.name"
                >
                    Bajarse
                </button>
                <button
                    class="game-button"
                    @click="meterCard"
                    v-show="thisPlayer.isDown && game.currentPlayer.name == thisPlayer.name"
                >
                    Meter
                </button>
                <button class="game-button" @click="showScores">Ver puntuaciones</button>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <div id="discard-pile">
                    <div
                        v-if="discardPile.length"
                        class="card"
                        @click="drawDiscard(thisPlayer.name)"
                    >
                        {{ discardPile[discardPile.length - 1].getCardString() }}
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <div id="players-hands">
                    <div class="hand">
                        <Card
                            v-for="(card, index) in thisPlayer.hand"
                            :key="card.id"
                            :card="card"
                            :index="index"
                            @increase-highest-z-index="increaseHighestZindex"
                            @discardCard="discardCard(index)"
                            :highestZIndex="highestZIndex"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <div id="table">
                    <div v-for="(group, index) in table" :key="index" class="pile">
                        <div v-for="card in group" :key="card.id" class="card">
                            {{ card.getCardString() }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Card from './Card.vue'

export default {
    components: { Card },
    props: {
        playerName: {
            required: true,
            type: String
        }
    },
    data() {
        return {
            game: null,
            currentPlayer: null,
            highestZIndex: 1000,
            thisPlayer: null,
            thisPlayerIndex: null,
            discardPile: [],
            table: [],
            gameMessages: [],
            turnMessages: [],
            hasDrawn: false,
            ws: null
        }
    },
    created() {
        this.ws = this.$commonWebSocket
        this.game = this.$commonGameObject
        this.game.addPlayer('')
        this.game.currentPlayer = this.game.players[0]
        this.currentPlayer = this.game.currentPlayer
        this.thisPlayer = this.currentPlayer

        this.ws.onmessage = (event) => {
            let message = JSON.parse(event.data)

            if (message.key == 'gameUpdated') {
                if (message.value) {
                    this.$commonGameObject.copy(message.value)
                    this.game = this.$commonGameObject
                    this.thisPlayer = this.$commonGameObject.getPlayer(this.playerName)
                    this.thisPlayerIndex = this.thisPlayer.index
                    this.currentPlayer = this.game.currentPlayer
                    this.updateState()
                } else {
                    this.$router.push('/')
                }
            }

            if (message.key == 'logMessages') {
                this.turnMessages = message.value.turnMessages
            }

            if (message.key == 'turnEnded') {
                if (this.playerName == message.value) {
                    alert('Es tu turno')
                } else {
                    alert(`Turno de ${message.value}`)
                }
            }

            if (message.key == 'roundEnded') {
                const winner = this.game.players[message.value]

                if (winner.name == this.playerName) {
                    alert('Has ganado esta ronda')
                } else {
                    alert(`${winner.name} ha ganado esta ronda`)
                }
            }
        }

        setTimeout(() => {
            this.ws.send(JSON.stringify({ key: 'updateGame' }))
        }, 100)

        setTimeout(() => {
            this.game = this.$commonGameObject

            this.thisPlayer = this.$commonGameObject.getPlayer(this.playerName)
            this.thisPlayerIndex = this.thisPlayer.index
            this.updateState()
        }, 200)
    },
    computed: {
        isMyTurn() {
            return this.currentPlayer.name == this.playerName
        }
    },
    mounted() {
        // this.ws.send(JSON.stringify({ key: 'updateGame'} ))
    },
    methods: {
        updateState() {
            this.discardPile = this.game.discardPile
            this.table = this.game.table
            this.hasDrawn = this.game.hasDrawn
        },
        drawCard() {
            if (this.checkIsMyTurn()) {
                if (this.game.drawCard(this.thisPlayer.index)) {
                    this.ws.send(
                        JSON.stringify({
                            key: 'playerDrawedCard',
                            value: this.playerName,
                            game: this.game
                        })
                    )
                }
            }
        },
        drawDiscard() {
            if (this.checkIsMyTurn()) {
                if (this.game.drawDiscard(this.thisPlayer.index)) {
                    this.ws.send(
                        JSON.stringify({
                            key: 'playerDrawedDiscard',
                            value: this.playerName,
                            game: this.game
                        })
                    )
                }
                this.updateState()
            }
        },
        discardCard(cardIndex) {
            if (this.checkIsMyTurn()) {
                if (this.game.discardCard(this.thisPlayer.index, cardIndex)) {
                    this.ws.send(
                        JSON.stringify({
                            key: 'playerDiscartedCard',
                            value: this.playerName,
                            game: this.game
                        })
                    )
                }
                this.updateState()
            }
        },
        goDown() {
            if (this.checkIsMyTurn()) {
                if (this.game.goDown(this.thisPlayerIndex)) {
                    this.ws.send(
                        JSON.stringify({
                            key: 'playerWentDown',
                            value: this.playerName,
                            game: this.game
                        })
                    )
                }
                this.updateState()
            }
        },
        meterCard() {
            if (this.checkIsMyTurn()) {
                if (this.game.meterCard(this.thisPlayerIndex)) {
                    this.ws.send(
                        JSON.stringify({
                            key: 'playerMetioCard',
                            value: this.playerName,
                            game: this.game
                        })
                    )
                }
                this.updateState()
            }
        },
        increaseHighestZindex() {
            this.highestZIndex++
        },
        showScores() {
            this.$router.push('/scores')
        },
        checkIsMyTurn() {
            if (this.isMyTurn) {
                return true
            } else {
                alert('No es tu turno')
                return false
            }
        }
    }
}
</script>

<style scoped></style>
