import { createRouter, createWebHashHistory } from "vue-router";

import MainView from "./views/MainView.vue";
import SettingsView from "./views/SettingsView.vue";

const routes = [
  { path: "/", component: MainView },
  { path: "/settings", component: SettingsView }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});
