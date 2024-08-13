import { createRouter, createWebHistory } from 'vue-router'
import ScoreView from '../views/ScoreView.vue'
import Game from '../components/Game.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/scores',
            name: 'scores',
            component: ScoreView
        },
        {
            path: '/',
            name: 'game',
            component: Game
        }
    ]
})

export default router
