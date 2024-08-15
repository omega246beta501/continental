import { createRouter, createWebHistory } from 'vue-router'
import ScoreView from '../views/ScoreView.vue'
import InitView from '../views/InitView.vue'
import WaitingRoomView from '../views/WaitingRoomView.vue'
import Game from '../components/Game.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'init',
            component: InitView
        },
        {
            path: '/waiting-room',
            name: 'waitingRoom',
            component: WaitingRoomView,
            props: route => ({ playerName: route.query.playerName })
        },
        {
            path: '/game',
            name: 'game',
            component: Game,
            props: route => ({ playerName: route.query.playerName })
        },
        {
            path: '/scores',
            name: 'scores',
            component: ScoreView
        },
    ]
})

export default router
