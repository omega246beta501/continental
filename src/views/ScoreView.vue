<template>
    <div>
        <div class="row">
            <div class="col-1">
                <button @click="goBack">Go Back</button>
            </div>
            <div class="col-11">
                <h1>Puntuaciones</h1>
            </div>
        </div>
        <div class="row">
            <div class="col-4">
                <h3>Nombre</h3>
            </div>
            <div class="col-4">
                <h3>Rondas ganadas</h3>
            </div>
            <div class="col-4">
                <h3>Puntuacion</h3>
            </div>
        </div>
        <div v-for="(player, index) in game.players" :key="index" class="row">
            <div class="col-4">
                <h3>{{ player.name }}</h3>
            </div>
            <div class="col-4">
                <h3>{{ player.roundsWon }}</h3>
            </div>
            <div class="col-4">
                <h3>{{ player.score }}</h3>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            game: null,
        }
    },
    created() {
        this.game = this.$commonGameObject;
    },
    methods: {
        goBack() {
            this.$router.go(-1); // Navigates back to the previous page
        }
    }
}
</script>

<style>

</style>
