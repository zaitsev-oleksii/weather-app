<template>
  <div class="flex gap-1 overflow-x-auto snap-x snap-mandatory no-scrollbar">
    <div
      v-for="(day, idx) in days"
      :key="day"
      class="p-2 w-36 snap-center bg-slate-300 rounded-md text-center"
      :class="{
        'bg-slate-400': day === selectedDay,
        'ml-auto': idx === 0,
        'mr-auto': idx === days.length - 1
      }"
      @click="setSelectedDay(day)"
    >
      <span class="block w-full text-lg">
        {{ day.datetime.toDateString().slice(0, 4) }}
      </span>
      <span class="block w-full text-md">
        {{ day.datetime.toDateString().slice(4, 10) }}
      </span>
      <img :src="day.imgSrc" alt="weather" class="mx-auto" />
      <span class="block w-full text-md">min: {{ day.minTemp }} °C</span>
      <span class="block w-full text-md">max: {{ day.maxTemp }} °C</span>
    </div>
  </div>
  <div
    class="flex flex-wrap justify-around gap-7 w-full mt-5 p-5"
    v-if="selectedDay"
  >
    <weather-details
      :sunrise="selectedDay.sunrise"
      :sunset="selectedDay.sunset"
      :humidity="selectedDay.humidity"
      :rainingChance="selectedDay.rainingChance"
      :uv="selectedDay.uv"
    />
  </div>
</template>

<script>
import { getForecastWeatherData as getData } from "../api";

import WeatherDetails from "./WeatherDetails.vue";

export default {
  name: "ForecastWeather",
  components: { WeatherDetails },
  data() {
    return {
      days: [],
      selectedDay: null
    };
  },
  props: {
    latlng: Object
  },
  activated() {
    if (this.days.length === 0 && this.latlng) {
      this.getForecastWeatherData(this.latlng);
    }
  },
  computed: {
    currentDay() {
      return this.days.find(
        (day) => day.datetime.toDateString() === new Date().toDateString()
      );
    }
  },
  methods: {
    async getForecastWeatherData({ lat, lng }) {
      const data = await getData({ lat, lng });
      const DAY_DATA_KEYS = new Set([
        "imgSrc",
        "datetime",
        "minTemp",
        "maxTemp",
        "sunrise",
        "sunset",
        "rainingChance",
        "humidity",
        "uv"
      ]);
      this.days = data.days.map((day) =>
        Object.fromEntries(
          Object.entries(day).filter((entry) => DAY_DATA_KEYS.has(entry[0]))
        )
      );
      //this.days = data;
      // console.log(data);
      this.setSelectedDay(this.currentDay);
    },
    setSelectedDay(day) {
      this.selectedDay = day;
    }
  },
  watch: {
    latlng() {
      this.getForecastWeatherData(this.latlng);
    }
  }
};
</script>
