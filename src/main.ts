import { createApp, reactive } from 'vue'
import './style.css'
import App from './App.vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import vuetify from './plugins/vuetify'
import router from './router'



const app = createApp(App);

const shoppingCart = reactive<{ items: { itemId: number; name: string; quantity: number }[] }>({ items: [] });
app.provide('shoppingCart', shoppingCart);
app.use(VueQueryPlugin);
app.use(vuetify())
app.use(router)
app.mount('#app');