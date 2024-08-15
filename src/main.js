// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Game } from './game'

const app = createApp(App)
const commonGameObject = new Game()
const commonWebSocket = new WebSocket('ws://localhost:8080');
app.config.globalProperties.$commonGameObject = commonGameObject
app.config.globalProperties.$commonWebSocket = commonWebSocket

app.use(router)

app.mount('#app')
