<template>
    <div id="game">
        <div class="row">
            <div class="col">
                <h1>Continental</h1>
                <h2>{{ game.currentPlayer.name }}</h2>
            </div>
        </div>
        <div class="row">
            <div id="controls" class="col">
                <button class="game-button" @click="drawCard" v-show="!game.hasDrawn">
                    Robar carta
                </button>
                <button class="game-button" @click="goDown" v-show="!game.currentPlayer.isDown">
                    Bajarse
                </button>
                <button class="game-button" @click="meterCard" v-show="game.currentPlayer.isDown">
                    Meter
                </button>
                <button class="game-button" @click="showScores">Ver puntuaciones</button>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <div id="discard-pile">
                    <div v-if="discardPile.length" class="card" @click="drawDiscard">
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

    data() {
        return {
            game: null,
            currentPlayer: null,
            highestZIndex: 1000,
            discardPile: [],
            table: []
        }
    },
    created() {
        this.game = this.$commonGameObject
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
        },
        showScores() {
            this.$router.push('/scores')
        }
    }
}
</script>

<style scoped></style>
