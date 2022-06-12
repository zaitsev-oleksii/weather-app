const LS_LOCATION_KEY = "weather-location";
const LS_PREFERENCES_KEY = "weather-preferences";

export const localStoragePlugin = (store) => {
  const locFromLS = window.localStorage.getItem(LS_LOCATION_KEY);
  if (locFromLS) {
    store.commit("setLocation", JSON.parse(locFromLS));
  }
  const prefsFromLS = window.localStorage.getItem(LS_PREFERENCES_KEY);
  if (prefsFromLS) {
    store.commit("setPreferences", JSON.parse(prefsFromLS));
  }

  store.subscribe((mutation, state) => {
    if (mutation.type === "setLocation") {
      window.localStorage.setItem(
        LS_LOCATION_KEY,
        JSON.stringify(state.location)
      );
    }
    if (mutation.type === "setPreferences") {
      window.localStorage.setItem(
        LS_PREFERENCES_KEY,
        JSON.stringify(state.preferences)
      );
    }
  });
};
