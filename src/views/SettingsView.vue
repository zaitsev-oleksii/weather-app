<template>
  <div
    class="fixed z-[1500] w-screen h-screen"
    style="background-color: rgba(0, 0, 0, 0.5)"
    @click.stop="handleBackdropClick"
  >
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 w-full md:w-2/3 lg:w-1/3 h-2/3 bg-custom-bunker rounded-3xl"
      @click.stop
    >
      <div class="flex flex-row p-3 w-full h-10 justify-between">
        <div class="text-azureish-white text-2xl font-semibold">
          Preferences
        </div>
        <div class="w-8 h-8">
          <router-link to="/"><img :src="backIcon" alt="" /></router-link>
        </div>
      </div>
      <div class="flex flex-col justify-evenly p-3 w-full h-full">
        <div class="inline-flex justify-between w-full h-10">
          <span class="text-azureish-white text-xl my-auto">Temperature</span>
          <div class="inline-flex ml-20" role="group">
            <button
              type="button"
              class="w-20 rounded-l-lg px-6 py-2 bg-custom-gunmetal border-y-2 border-l-2 border-custom-abbey text-azureish-white text-lg leading-tight uppercase hover:bg-custom-dark-gunmetal hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
              :class="{
                'bg-custom-abbey font-bold border-r-2 border-neutral-300':
                  tempPreference === preferencesConfig.temperature.celsius
              }"
              @click="setTempPreference(preferencesConfig.temperature.celsius)"
            >
              °C
            </button>
            <button
              type="button"
              class="w-20 rounded-r-lg px-6 py-2 bg-custom-gunmetal border-y-2 border-r-2 border-custom-abbey text-azureish-white text-lg leading-tight uppercase hover:bg-custom-dark-gunmetal hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
              :class="{
                'bg-custom-abbey font-bold border-l-2 border-neutral-300':
                  tempPreference === preferencesConfig.temperature.fahrenheit
              }"
              @click="
                setTempPreference(preferencesConfig.temperature.fahrenheit)
              "
            >
              °F
            </button>
          </div>
        </div>
        <div class="w-full h-10 inline-flex justify-between">
          <span class="text-azureish-white text-xl my-auto">Wind speed</span>
          <div class="inline-flex ml-20" role="group">
            <button
              type="button"
              class="w-20 rounded-l-lg px-3 py-2 bg-custom-gunmetal border-y-2 border-l-2 border-custom-abbey text-azureish-white text-lg leading-tight uppercase hover:bg-custom-dark-gunmetal hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
              :class="{
                'bg-custom-abbey font-bold border-r-2 border-neutral-300':
                  windSpeedPreference === preferencesConfig.windSpeed.kmph
              }"
              @click="setWindSpeedPreference(preferencesConfig.windSpeed.kmph)"
            >
              kph
            </button>
            <button
              type="button"
              class="w-20 px-3 py-2 bg-custom-gunmetal border-y-2 border-custom-abbey text-azureish-white text-lg leading-tight uppercase hover:bg-custom-dark-gunmetal hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
              :class="{
                'bg-custom-abbey font-bold border-x-2 border-neutral-300':
                  windSpeedPreference === preferencesConfig.windSpeed.mps
              }"
              @click="setWindSpeedPreference(preferencesConfig.windSpeed.mps)"
            >
              m/s
            </button>
            <button
              type="button"
              class="w-20 rounded-r-lg px-3 py-2 bg-custom-gunmetal border-y-2 border-r-2 border-custom-abbey text-azureish-white text-lg leading-tight uppercase hover:bg-custom-dark-gunmetal hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
              :class="{
                'bg-custom-abbey font-bold border-l-2 border-neutral-300':
                  windSpeedPreference === preferencesConfig.windSpeed.mph
              }"
              @click="setWindSpeedPreference(preferencesConfig.windSpeed.mph)"
            >
              mph
            </button>
          </div>
        </div>
        <div class="w-full h-10 inline-flex justify-between">
          <span class="text-azureish-white text-xl my-auto">Pressure</span>
          <div class="inline-flex ml-20" role="group">
            <button
              type="button"
              class="w-20 rounded-l-lg px-4 py-2 bg-custom-gunmetal border-y-2 border-l-2 border-custom-abbey text-azureish-white text-lg leading-tight uppercase hover:bg-custom-dark-gunmetal hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
              :class="{
                'bg-custom-abbey font-bold border-r-2 border-neutral-300':
                  pressurePreference === preferencesConfig.pressure.inhg
              }"
              @click="setPressurePreference(preferencesConfig.pressure.inhg)"
            >
              inhg
            </button>
            <button
              type="button"
              class="w-20 rounded-r-lg px-4 py-2 bg-custom-gunmetal border-y-2 border-r-2 border-custom-abbey text-azureish-white text-lg leading-tight uppercase hover:bg-custom-dark-gunmetal hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
              :class="{
                'bg-custom-abbey font-bold border-l-2 border-neutral-300':
                  pressurePreference === preferencesConfig.pressure.kpa
              }"
              @click="setPressurePreference(preferencesConfig.pressure.kpa)"
            >
              kpa
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import backIcon from "../assets/icons/backArrow.svg";

import { preferencesConfig } from "../config";

export default {
  name: "SettingsView",
  setup() {
    const store = useStore();
    const router = useRouter();

    const tempPreference = computed(() => store.state.preferences.temperature);
    const windSpeedPreference = computed(
      () => store.state.preferences.windSpeed
    );
    const pressurePreference = computed(() => store.state.preferences.pressure);

    const updatePreferences = (prefName, newPref) => {
      store.commit("setPreferences", {
        [prefName]: newPref
      });
    };

    const setTempPreference = (newPref) =>
      updatePreferences("temperature", newPref);
    const setWindSpeedPreference = (newPref) =>
      updatePreferences("windSpeed", newPref);
    const setPressurePreference = (newPref) =>
      updatePreferences("pressure", newPref);

    const handleBackdropClick = () => {
      router.push({ name: "main" });
    };

    return {
      tempPreference,
      windSpeedPreference,
      pressurePreference,
      preferencesConfig,
      setTempPreference,
      setWindSpeedPreference,
      setPressurePreference,
      backIcon,
      handleBackdropClick
    };
  }
};
</script>
