import { createApp } from "vue";

import App from "./App.vue";
import "./assets/tailwind.css";

import { store } from "./store";
import { router } from "./router";

const app = createApp(App);

app.use(router);
app.use(store);

const locFromLS = window.localStorage.getItem("weather-location");
if (locFromLS) {
  store.commit("setLocation", JSON.parse(locFromLS));
}
const prefsFromLS = window.localStorage.getItem("weather-preferences");
if (prefsFromLS) {
  store.commit("setPreferences", JSON.parse(prefsFromLS));
}

store.subscribe((mutation, state) => {
  if (mutation.type === "setLocation") {
    window.localStorage.setItem(
      "weather-location",
      JSON.stringify(state.location)
    );
  }
  if (mutation.type === "setPreferences") {
    window.localStorage.setItem(
      "weather-preferences",
      JSON.stringify(state.preferences)
    );
  }
});

app.mount("#app");
