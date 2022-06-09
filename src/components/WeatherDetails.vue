<template>
  <div class="flex flex-row gap-4 shrink-0 basis-24 w-full h-full">
    <weather-detail-card v-if="humidity !== undefined">
      <template #title> Humidity </template>
      <template #value> {{ humidity }}% </template>
      <template #icon><humidity-icon :fill="humidity" /></template>
    </weather-detail-card>

    <weather-detail-card v-if="windSpeed !== undefined">
      <template #title> Wind </template>
      <template #value> {{ formattedWindSpeed }}</template>
      <template #icon
        ><img :src="icons.windIcon" alt="" class="w-full h-full"
      /></template>
    </weather-detail-card>

    <weather-detail-card v-if="pressure !== undefined">
      <template #title> Pressure </template>
      <template #value> {{ formattedPressure }} {{ pressureUnit }}</template>
      <template #icon
        ><img :src="icons.pressureIcon" alt="" class="w-full h-full"
      /></template>
    </weather-detail-card>

    <weather-detail-card v-if="cloudCover !== undefined">
      <template #title> Cloud </template>
      <template #value> {{ cloudCover }}% </template>
      <template #icon
        ><img :src="icons.cloudIcon" alt="" class="w-full h-full"
      /></template>
    </weather-detail-card>

    <weather-detail-card v-if="uv !== undefined">
      <template #title> UV </template>
      <template #value> {{ uv }}</template>
      <template #icon
        ><img :src="icons.uvIcon" alt="" class="w-full h-full"
      /></template>
    </weather-detail-card>

    <weather-detail-card v-if="rainingChance !== undefined">
      <template #title> Rain </template>
      <template #value>{{ rainingChance.toFixed(0) }}%</template>
      <template #icon
        ><img :src="icons.rainIcon" alt="" class="w-full h-full"
      /></template>
    </weather-detail-card>

    <weather-detail-card v-if="sunrise">
      <template #title> Sunrise </template>
      <template #value>
        {{ new Date(sunrise).toTimeString().slice(0, 5) }}
      </template>
      <template #icon></template>
    </weather-detail-card>

    <weather-detail-card v-if="sunset">
      <template #title> Sunset </template>
      <template #value>
        {{ new Date(sunset).toTimeString().slice(0, 5) }}</template
      >
      <template #icon></template>
    </weather-detail-card>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

import { preferencesConfig } from "../config";
import { formatPressure, formatWindSpeed } from "../helpers";

import WeatherDetailCard from "./WeatherDetailCard.vue";

import windIcon from "../assets/icons/wind.svg";
import pressureIcon from "../assets/icons/pressure.svg";
import cloudIcon from "../assets/icons/cloudiness.svg";
import uvIcon from "../assets/icons/uv.svg";
import rainIcon from "../assets/icons/rain.svg";

import HumidityIcon from "./icons/HumidityIcon.vue";

const icons = {
  windIcon,
  pressureIcon,
  cloudIcon,
  uvIcon,
  rainIcon
};

// const tsToTimeString = (ts) => new Date(ts).toTimeString().slice(0, 5);

export default {
  name: "WeatherDetails",
  components: { WeatherDetailCard, HumidityIcon },
  props: {
    humidity: Number,
    windSpeed: Number,
    windDegree: Number,
    pressure: Number,
    cloudCover: Number,
    aqi: Number,
    uv: Number,
    sunrise: Number,
    sunset: Number,
    rainingChance: Number,
    minTemp: Number,
    maxTemp: Number
  },
  setup(props) {
    const store = useStore();

    const windSpeedPreference = computed(() => store.state.windSpeedPreference);
    const pressurePreference = computed(() => store.state.pressurePreference);

    const formattedWindSpeed = computed(() =>
      formatWindSpeed(props.windSpeed, windSpeedPreference.value).toFixed(1)
    );
    const formattedPressure = computed(() =>
      formatPressure(props.pressure, pressurePreference.value).toFixed(0)
    );

    const pressureUnit = computed(() => {
      if (pressurePreference.value === preferencesConfig.pressure.inhg)
        return "in";
      if (pressurePreference.value === preferencesConfig.pressure.kpa)
        return "kpa";
      return "";
    });

    return {
      formattedWindSpeed,
      formattedPressure,
      pressureUnit,
      icons,
      preferencesConfig
    };
  }
};
</script>
