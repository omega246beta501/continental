<template>
    <div id="game">
        <h1>Card Game</h1>
        <div id="controls">
            <button class="game-button" @click="drawCard" :disabled="game.hasDrawn">
                Robar carta
            </button>
            <button class="game-button" @click="goDown" v-show="!game.currentPlayer.isDown">
                Go Down
            </button>
            <button class="game-button" @click="meterCard" v-show="game.currentPlayer.isDown">
                Meter Card
            </button>
        </div>
        <div id="players-hands">
            <h2>{{ game.currentPlayer.name }}</h2>
            <!-- <div class="hand">
                <div v-for="(card, index) in currentPlayer.hand" :key="card.id" class="card" @click="discardCard(index)">
                    {{ card.getCardString() }}
                </div>
            </div> -->
            <div class="hand">
                <Card
                    v-for="(card, index) in currentPlayer.hand"
                    :key="card.id"
                    :card="card"
                    :index="index"
                    @increase-highest-z-index="increaseHighestZindex"
                    @discardCard="discardCard(index)"
                    :highestZIndex="highestZIndex"
                />
            </div>
        </div>
        <div id="discard-pile">
            <div v-if="discardPile.length" class="card" @click="drawDiscard">
                {{ discardPile[discardPile.length - 1].getCardString() }}
            </div>
        </div>
        <div id="table">
            <div v-for="(group, index) in table" :key="index" class="pile">
                <div v-for="card in group" :key="card.id" class="card">
                    {{ card.getCardString() }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Game } from '../game.js' // Import the Game class
import Card from './Card.vue'

export default {
    components: { Card },

    data() {
        return {
            game: new Game(),
            currentPlayer: null,
            highestZIndex: 1000,
            discardPile: [],
            table: []
        }
    },
    created() {
        this.game = new Game(2)
        this.updateState()
    },
    mounted() {
        // this.game = new Game();
        // this.updateState();
    },
    methods: {
        updateState() {
            this.currentPlayer = this.game.currentPlayer
            this.discardPile = this.game.discardPile
            this.table = this.game.table
        },
        drawCard() {
            this.game.drawCard()
            this.updateState()
        },
        drawDiscard() {
            this.game.drawDiscard()
            this.updateState()
        },
        discardCard(index) {
            this.game.discardCard(index)
            this.updateState()
        },
        goDown() {
            this.game.goDown()
            this.updateState()
        },
        meterCard() {
            this.game.meterCard()
            this.updateState()
        },
        increaseHighestZindex() {
            this.highestZIndex++
        }
    }
}
</script>

<style scoped></style>
