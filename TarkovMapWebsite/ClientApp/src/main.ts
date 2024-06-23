import {createApp} from 'vue';
import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import OpenLayersMap from "vue3-openlayers";
import Toast from "vue-toastification";

import "vue-toastification/dist/index.css";
import "vue3-openlayers/styles.css";
import './style.css';

import App from './App.vue';
import Home from "./pages/Home.vue";
import {Maps} from "./maps.ts";
import MapPage from "./pages/MapPage.vue";

// Router config
const routes = [
    {path: '/', component: Home},
    ...Maps.map(x => ({ path: x.link, component: MapPage, props: { title: x.name, mapUrl: x.img, credit: x.credit } } as RouteRecordRaw))
];

const router = createRouter({
    history: createWebHistory(),
    routes,
})


const app = createApp(App)
app.use(router);
app.use(Toast);
app.use(OpenLayersMap);
app.mount('#app');
