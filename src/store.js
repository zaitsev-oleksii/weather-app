import { createStore } from "vuex";

import { preferencesConfig } from "./config";

export const store = createStore({
  state() {
    return {
      location: null,
      preferences: {
        temperature: preferencesConfig.temperature.celsius,
        windSpeed: preferencesConfig.windSpeed.mps,
        pressure: preferencesConfig.pressure.inhg
      }
    };
  },
  getters: {
    tempPref: (state) => state.preferences.temperature,
    windSpeedPref: (state) => state.preferences.windSpeed,
    pressurePref: (state) => state.preferences.pressure
  },
  mutations: {
    setLocation(state, location) {
      const { lat, lng } = location;
      state.location = { lat, lng };
    },
    setPreferences(state, newPreferences) {
      state.preferences = {
        ...state.preferences,
        ...newPreferences
      };
    }
  }
});
