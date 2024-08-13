class Player {
    constructor(name) {
        this.hand = []
        this.roundsWon = 0
        this.score = 0
        this.isDown = false
        this.name = name
    }

    recalculateScore() {
        let points = 0
        const characters = ['J', 'Q', 'K']

        this.hand.forEach((card) => {
            if (card.value == 'Joker') {
                points += 25
            } else if (characters.includes(card.value)) {
                points += 10
            } else if (card.value == 'A') {
                points += 1
            } else {
                points += Number(card.value)
            }
        })

        this.score += points
        return points
    }
}

class Card {
    static idOffset = 0

    constructor(suit, value) {
        this.suit = suit
        this.value = value
        this.id = `card${Card.idOffset}`
        Card.idOffset++
        this.top = null
        this.left = null
    }

    getCardString() {
        return this.suit ? `${this.value} ${this.suit}` : this.value
    }
}

class Deck {
    constructor() {
        this.cards = []
        const suits = ['♠', '♥', '♣', '♦']
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

        for (let index = 0; index < 2; index++) {
            for (let suit of suits) {
                for (let value of values) {
                    this.cards.push(new Card(suit, value))
                }
            }
        }

        this.cards.push(new Card(null, 'Joker')) // Add jokers
        this.cards.push(new Card(null, 'Joker')) // Add jokers
        this.shuffle()
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]
        }
    }

    draw() {
        return this.cards.pop()
    }
}

class Game {
    constructor(numPlayers = 4) {
        this.deck = new Deck()
        this.players = Array.from({ length: numPlayers }, (v, i) => new Player(`Jugador ${i + 1}`))
        this.roundDealNumber = [7, 8, 9, 10, 11, 12, 13]
        this.contracts = [this.contractTwoTrios]
        this.discardPile = []
        this.table = []
        this.currentPlayerIndex = 0
        this.currentPlayer = this.players[this.currentPlayerIndex]
        this.hasDrawn = false
        this.hasDiscarded = false
        this.currentRound = 0
        this.setup()
    }

    setup() {
        this.drawInitialHands()
    }

    drawInitialHands() {
        this.hasDrawn = false
        this.hasDiscarded = false

        this.players.forEach((player) => {
            player.hand = []
            player.isDown = false
        })

        this.table = []
        this.discardPile = []

        for (let i = 0; i < this.roundDealNumber[this.currentRound]; i++) {
            this.players.forEach((player) => {
                player.hand.push(this.deck.draw())
            })
        }

        // const suits = ['♠', '♥', '♣', '♦']

        // this.players[0].hand = [
        //     new Card(suits[0], '2'),
        //     new Card(suits[1], '2'),
        //     new Card(suits[2], '2'),
        //     new Card(suits[2], 'K'),
        //     new Card(suits[3], 'K'),
        //     new Card(suits[1], 'K'),
        //     new Card(suits[1], 'A'),
        // ];

        this.discardPile.push(this.deck.draw())
    }

    drawCard() {
        if (this.hasDrawn) {
            alert('Ya has robado una carta en este turno.')
            return
        }
        const card = this.deck.draw()
        this.currentPlayer.hand.push(card)
        this.hasDrawn = true
    }

    drawDiscard() {
        if (this.hasDrawn) {
            alert('Ya has robado una carta en este turno.')
            return
        }
        if (this.discardPile.length === 0) {
            alert('No hay cartas en la pila de descarte.')
            return
        }
        const card = this.discardPile.pop()
        this.currentPlayer.hand.push(card)
        this.hasDrawn = true
    }

    discardCard(cardIndex) {
        if (!this.hasDrawn) {
            alert('Debes robar una carta antes de descartar.')
            return
        }
        if (this.hasDiscarded) {
            alert('Ya has descartado una carta en este turno.')
            return
        }
        const card = this.currentPlayer.hand.splice(cardIndex, 1)[0]
        this.discardPile.push(card)
        this.hasDiscarded = true
        this.endTurn()
    }

    addToTable(card) {
        for (let group of this.table) {
            if (group.length > 0) {
                const groupValue = group.find((c) => c.value !== 'Joker').value
                if (card.value === groupValue || card.value === 'Joker') {
                    group.push(card)
                    return true
                }
            }
        }
        return false
    }

    meterCard() {
        if (this.currentPlayer.isDown) {
            const playerHand = this.currentPlayer.hand
            if (playerHand.length <= 1) {
                alert('No puedes meter tu última carta.')
                return
            }

            for (let i = 0; i < playerHand.length; i++) {
                const card = playerHand[i]
                if (this.addToTable(card)) {
                    playerHand.splice(i, 1)
                    return
                }
            }
            alert('No hay cartas válidas para meter.')
        } else {
            alert('No puedes meter cartas si no te has bajado')
        }
    }

    endTurn() {
        if (!this.hasDrawn || !this.hasDiscarded) {
            alert('Debes robar y descartar una carta antes de terminar tu turno.')
            return
        }
        const player = this.currentPlayer
        if (player.hand.length == 0) {
            alert('Enhorabuena has ganado esta ronda')
            this.endRound()
        } else {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length
            this.currentPlayer = this.players[this.currentPlayerIndex]
            this.hasDrawn = false
            this.hasDiscarded = false
        }
    }

    endRound() {
        this.currentRound++
        let winner = this.currentPlayer
        winner.roundsWon++
        winner.score -= (this.currentRound + 1) * 10

        this.players.forEach((player) => {
            player.recalculateScore()
            alert(`${player.name}: ${player.score} puntos.`)
        })

        if (this.currentRound >= this.roundDealNumber.length) {
            alert('El juego ha terminado')
        } else {
            this.setup()
        }
    }

    checkContract() {
        const playerHand = this.currentPlayer.hand
        const contractFunction = this.contracts[this.currentRound]
        return contractFunction(playerHand)
    }

    goDown() {
        if (this.hasDrawn) {
            const trios = this.checkContract()
            const playerHand = this.currentPlayer.hand

            if (trios) {
                // Calculate the remaining cards after forming trios
                let cardsUsed = new Set()
                trios.flat().forEach((card) => cardsUsed.add(card.id))

                let remainingCards = playerHand.filter((card) => !cardsUsed.has(card.id))
                let numRemainingCards = remainingCards.length

                if (numRemainingCards <= 4) {
                    this.currentPlayer.isDown = true
                    this.moveToTable(trios)
                } else {
                    alert('No puedes bajarte porque tienes más de 4 cartas restantes.')
                }
            } else {
                alert('No cumples con el contrato de la ronda.')
            }
        } else {
            alert('Para poder bajarte debes robar primero')
        }
    }

    moveToTable(groups) {
        const player = this.currentPlayer
        groups.forEach((group) => {
            this.table.push(group)
            group.forEach((card) => {
                const index = player.hand.indexOf(card)
                if (index !== -1) {
                    player.hand.splice(index, 1)
                }
            })
        })
    }

    contractTwoTrios(hand) {
        const valueCount = {} // To count occurrences of each value
        const jokers = [] // To count jokers

        // Initialize valueCount and jokers
        for (let card of hand) {
            if (card.value === 'Joker') {
                jokers.push(card)
            } else {
                if (!valueCount[card.value]) {
                    valueCount[card.value] = []
                }
                valueCount[card.value].push(card)
            }
        }

        // Find all valid trios
        let trios = []
        for (let value in valueCount) {
            let group = valueCount[value]
            let numCards = group.length
            let numJokers = jokers.length
            if (numCards + numJokers >= 3) {
                // Calculate actual number of trios
                let totalCards = numCards + numJokers
                let numTrios = Math.floor(totalCards / 3)

                for (let i = 0; i < numTrios; i++) {
                    trios.push(
                        group
                            .slice(i * 3, (i + 1) * 3)
                            .concat(jokers.slice(0, 3 - group.slice(i * 3, (i + 1) * 3).length))
                    )
                    jokers.splice(0, 3 - group.slice(i * 3, (i + 1) * 3).length)
                }
            }
        }

        // Sort trios to make sure we have at least 2
        if (trios.length >= 2) {
            return trios.slice(0, 2) // Return the first 2 valid trios
        }

        return null // Not enough trios to meet the contract
    }
}

export { Game }
