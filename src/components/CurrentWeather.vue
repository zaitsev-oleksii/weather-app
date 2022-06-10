<template>
  <span class="ml-2 text-2xl text-white">{{
    new Date().toGMTString().slice(0, 11)
  }}</span>
  <div class="mt-2 w-full h-full px-8 py-5 rounded-3xl bg-custom-dark-gunmetal">
    <div class="float-left flex flex-col grow w-2/5 h-full">
      <span class="w-full">
        <span class="text-7xl font-bold text-white">{{
          temp?.toFixed(0)
        }}</span>
        <span class="ml-2 text-4xl align-top font-bold text-white"
          >°{{ displayedTempUnit }}</span
        >
      </span>
      <span class="mt-1 w-full text-white"
        >Feels like {{ feelsLikeTemp?.toFixed(0) }} °</span
      >
      <span class="self-end w-full mt-auto text-white"
        >GMT - {{ new Date().toGMTString().slice(17, 22) }}</span
      >
    </div>
    <div class="float-left flex flex-col grow w-3/5 h-full">
      <img
        v-if="weatherIcon"
        :src="weatherIcon"
        alt=""
        class="ml-10 w-2/3 h-2/3"
      />
      <span class="self-end w-full mt-auto text-white font-semibold">{{
        weatherConditionText.substring(0, 1).toUpperCase() +
        weatherConditionText.substring(1)
      }}</span>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from "vue";
import { useStore } from "vuex";

import { getCurrentWeatherData as getData } from "../api";

import {
  weatherConditionIconConfig as iconConfig,
  preferencesConfig,
  displayedUnits
} from "../config";

import { kelvinsToPreferredTemp } from "../helpers";

export default {
  name: "CurrentWeather",
  setup() {
    const store = useStore();

    const weatherId = ref(undefined);
    const temp = ref(undefined);
    const feelsLikeTemp = ref(undefined);
    const sunrise = ref(undefined);
    const sunset = ref(undefined);
    const datetime = ref(undefined);
    const weatherConditionText = ref("");

    const currentLocation = computed(() => store.state.location);
    const tempPreference = computed(() => store.state.preferences.temperature);
    const displayedTempUnit = computed(
      () => displayedUnits["temperature"][tempPreference.value]
    );

    onMounted(() => {
      if (currentLocation.value) {
        getCurrentWeatherData(currentLocation.value);
      }
    });

    // const time = computed(() => datetime.value.slice(-5));

    const isDay = computed(() => {
      return sunrise.value < datetime.value && datetime.value < sunset.value;
    });

    const weatherIcon = computed(() => {
      if (!weatherId.value) {
        return;
      }

      const iconPath = "assets/icons/condition";
      const iconName = iconConfig[weatherId.value];
      const time = isDay.value ? "day" : "night";

      return require(`@/${iconPath}/${time}/${iconName}`);
    });

    const getCurrentWeatherData = async ({ lat, lng }) => {
      const data = await getData({ lat, lng });

      datetime.value = new Date(data.datetime);
      sunrise.value = new Date(data.sunrise);
      sunset.value = new Date(data.sunset);
      temp.value = kelvinsToPreferredTemp(data.temp, tempPreference.value);
      weatherId.value = data.weatherId;
      weatherConditionText.value = data.text;
      feelsLikeTemp.value = kelvinsToPreferredTemp(
        data.feelsLikeTemp,
        tempPreference.value
      );
    };

    watch(currentLocation, () => {
      getCurrentWeatherData(currentLocation.value);
    });

    return {
      temp,
      feelsLikeTemp,
      tempPreference,
      displayedTempUnit,
      preferencesConfig,
      weatherIcon,
      weatherConditionText
    };
  }
};
</script>

<style></style>
