<template>
    <div>
        <div class="row">
            <div class="col">
                <h1>Introduce tu nombre de jugador</h1>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <input type="text" v-model="playerName" value="omega">
                <input @click="submitName" class="game-button" type="button" value="Insertar">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            playerName: ''
        }
    },
    created() {
    },
    methods: {
        submitName() {
            if(this.playerName == '') {
                alert("Tu nombre no puede estar vacío")
            }
            else {
                this.$commonWebSocket.send(JSON.stringify({
                    key: 'addPlayer',
                    value: this.playerName
                }))
                this.$router.push({
                    name: 'waitingRoom',
                    query: {
                        playerName: this.playerName
                    }
                })
            }
        }
    }
}
</script>

<style></style>
