<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
            <component :is="Component" />
        </transition>
    </RouterView>
</template>

<style>
@import './assets/styles.css';
</style>
