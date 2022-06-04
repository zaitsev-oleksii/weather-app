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
        <span class="ml-2 text-4xl align-top font-bold text-white">°C</span>
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
      <!-- <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="white"
        class="ml-10 w-2/3 h-2/3"
        viewBox="0 0 16 16"
      >
        <path
          d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"
        />
      </svg> -->
      <span class="self-end w-full mt-auto text-white font-semibold">{{
        text
      }}</span>
    </div>
  </div>
  <!-- <div class="w-full flex p-3 bg-slate-300 rounded-md">
    <div class="w-2/5 float-left flex flex-col">
      <img :src="imgSrc" alt="" class="ml-1 w-16 h-16" />
      <span class="ml-2 text-left font-semibold text-lg">{{ text }}</span>
      <span class="ml-2 text-left">{{ time }}</span>
    </div>
    <div class="w-3/5 float-right p-2 flex flex-col">
      <span class="text-right font-bold text-5xl">{{ currentTemp }}°</span>
      <span class="text-right text-md mt-4"
        >Feels like {{ feelsLikeTemp }}°
      </span>
    </div>
  </div> -->
</template>

<script>
import { getCurrentWeatherData as getData } from "../api";

import { weatherConditionIconConfig as iconConfig } from "../config";

const kelvinsToCelsius = (temp) => temp - 273.15;

export default {
  name: "CurrentWeather",
  props: {
    latlng: Object
  },
  data() {
    return {
      weatherId: undefined,
      place: "",
      temp: undefined,
      feelsLikeTemp: undefined,
      sunrise: undefined,
      sunset: undefined,
      // imgSrc: "",
      datetime: "",
      text: ""
    };
  },
  mounted() {
    if (this.latlng) {
      this.getCurrentWeatherData(this.latlng);
    }
  },
  computed: {
    time() {
      return this.datetime.slice(-5);
    },
    isDay() {
      return this.sunrise < this.datetime && this.datetime < this.sunset;
    },
    weatherIcon() {
      if (!this.weatherId) {
        return;
      }

      const iconPath = "assets/icons/condition";
      const iconName = iconConfig[this.weatherId];
      const time = this.isDay ? "day" : "night";

      return require(`@/${iconPath}/${time}/${iconName}`);
    }
  },
  methods: {
    async getCurrentWeatherData({ lat, lng }) {
      const data = await getData({ lat, lng });
      // this.imgSrc = data.imgSrc;
      this.datetime = new Date(data.datetime);
      this.sunrise = new Date(data.sunrise);
      this.sunset = new Date(data.sunset);
      this.temp = kelvinsToCelsius(data.temp);
      this.weatherId = data.weatherId;
      this.text = data.text;
      this.feelsLikeTemp = kelvinsToCelsius(data.feelsLikeTemp);
    }
  },
  watch: {
    latlng() {
      this.getCurrentWeatherData(this.latlng);
    }
  }
};
</script>

<style></style>
