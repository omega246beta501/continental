<template>
    <div>
        <div class="row">
            <div class="col">
                <h1>Esperando al resto de jugadores...</h1>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <input @click="sendStartGameSignal" v-show="isPlayerAdmin" class="game-button" type="button" value="Iniciar juego">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            webSocket: null
        }
    },
    props: ['playerName'],

    created() {
        this.ws = this.$commonWebSocket
        this.ws.onmessage = (event) => {

            let message = JSON.parse(event.data)
            if (message.key == 'startGame') {
                this.$commonGameObject.copy(message.value)
                console.log(this.$commonGameObject)
                this.startGame()
            }
        };
    },
    computed: {
        isPlayerAdmin() {
            return this.playerName == 'omega'
        },
    },
    methods: {
        sendStartGameSignal() {
            this.ws.send(JSON.stringify({ key: 'startGame'} ))
        },
        startGame() {
            alert("Empieza el juego")
            this.$router.push({
                name: 'game',
                query: {
                    playerName: this.playerName
                }
            })
        }
    }
}
</script>

<style></style>
