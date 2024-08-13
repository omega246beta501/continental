// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Game } from './game'

const app = createApp(App)
const commonGameObject = new Game(2);

app.config.globalProperties.$commonGameObject = commonGameObject;

app.use(router)

app.mount('#app')
