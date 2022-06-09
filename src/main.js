import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import { createStore } from "vuex";

import App from "./App.vue";
import "./assets/tailwind.css";

import MainView from "./views/MainView.vue";
import SettingsView from "./views/SettingsView.vue";

import { preferencesConfig } from "./config";

const routes = [
  { path: "/", component: MainView },
  { path: "/settings", component: SettingsView }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

const store = createStore({
  state() {
    return {
      location: null,
      tempPreference: preferencesConfig.temperature.celsius,
      windSpeedPreference: preferencesConfig.windSpeed.kmph,
      pressurePreference: preferencesConfig.pressure.kpa
    };
  },
  mutations: {
    setLocation(state, location) {
      const { lat, lng } = location;
      state.location = { lat, lng };
    },
    setTempPreference(state, newPref) {
      state.tempPreference = newPref;
    },
    setWindSpeedPreference(state, newPref) {
      state.windSpeedPreference = newPref;
    },
    setPressurePreference(state, newPref) {
      state.pressurePreference = newPref;
    }
  }
});

const app = createApp(App);

app.use(router);
app.use(store);

app.mount("#app");
