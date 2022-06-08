import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";

import App from "./App.vue";
import "./assets/tailwind.css";

import MainView from "./views/MainView.vue";
import SettingsView from "./views/SettingsView.vue";

const routes = [
  { path: "/", component: MainView },
  { path: "/settings", component: SettingsView }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

const app = createApp(App);

app.use(router);

app.mount("#app");
