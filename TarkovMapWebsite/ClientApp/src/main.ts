import {createApp} from 'vue';
import "vue-toastification/dist/index.css";
import './style.css';
import App from './App.vue';
import Home from "./pages/Home.vue";
import {createRouter, createWebHistory} from "vue-router";
import Toast from "vue-toastification";
import About from "./pages/About.vue";
import Woods from "./pages/Woods.vue";
import Interchange from "./pages/Interchange.vue";
import Shoreline from "./pages/Shoreline.vue";
import Factory from "./pages/Factory.vue";
import StreetsOfTarkov from "./pages/StreetsOfTarkov.vue";

// Router config
const routes = [
    {path: '/', component: Home},
    {path: '/about', component: About},
    {path: '/woods', component: Woods},
    {path: '/interchange', component: Interchange},
    {path: '/shoreline', component: Shoreline},
    {path: '/factory', component: Factory},
    {path: '/streetsoftarkov', component: StreetsOfTarkov},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
})


const app = createApp(App)
app.use(router);
app.use(Toast);
app.mount('#app');
