import { createRouter, createWebHashHistory } from "vue-router";

import MainView from "./views/MainView.vue";
import SettingsView from "./views/SettingsView.vue";

const routes = [
  {
    name: "main",
    path: "/",
    component: MainView,
    children: [{ name: "settings", path: "settings", component: SettingsView }]
  }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});
