import {createApp} from 'vue';
import "vue-toastification/dist/index.css";
import './style.css';
import App from './App.vue';
import Home from "./pages/Home.vue";
import {createRouter, createWebHistory} from "vue-router";
import Toast from "vue-toastification";
import About from "./pages/About.vue";
import Todos from "./pages/Todos.vue";

// Router config
const routes = [
    {path: '/', component: Home},
    {path: '/about', component: About},
    {path: '/todos', component: Todos}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
})


const app = createApp(App)
app.use(router);
app.use(Toast);
app.mount('#app');
