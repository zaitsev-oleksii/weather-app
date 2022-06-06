<template>
  <div class="flex flex-col lg:flex-row w-full lg:h-full">
    <div
      class="order-last lg:order-first mt-3 w-full lg:w-62/100 h-44 lg:h-full"
      v-if="selectedDay"
    >
      <weather-details
        :humidity="selectedDay.humidity"
        :sunrise="selectedDay.sunrise"
        :sunset="selectedDay.sunset"
        :rainingChance="selectedDay.rainingChance"
        :uv="selectedDay.uv"
      />
    </div>
    <div
      class="order-first lg:order-last mt-3 lg:pl-6 w-full lg:w-38/100 h-44 lg:h-full"
    >
      <div class="p-3 w-full h-full rounded-3xl bg-custom-dark-gunmetal">
        <div
          class="flex flex-row gap-3 w-full h-full rounded-3xl overflow-x-auto snap-x snap-mandatory no-scrollbar"
          ref="hours"
        >
          <div
            class="flex flex-col shrink-0 basis-24 p-2 h-full text-center rounded-2xl bg-custom-gunmetal"
            :class="{
              'bg-custom-abbey': day === selectedDay
            }"
            v-for="day in days"
            :key="day"
            @click="setSelectedDay(day)"
            ref="hour"
          >
            <span class="w-full text-white">{{
              day.datetime.toDateString().slice(0, 4)
            }}</span>
            <span class="my-auto w-full"
              ><img :src="day.weatherIcon" alt=""
            /></span>
            <span class="mt-auto mb-1 w-full">
              <span class="mt-auto text-3xl font-bold text-white">{{
                day.avgTemp.toFixed(0)
              }}</span>
              <span class="align-top font-bold text-white">°C</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDailyWeatherData as getDailyWeatherDataAPI } from "../api";

import { weatherConditionIconConfig as iconConfig } from "../config";

import WeatherDetails from "./WeatherDetails.vue";

const kelvinsToCelsius = (temp) => temp - 273.15;

// const parseTime = (ts) => {
//   // return new Date(new Date().toString().slice(0, 16) + " " + str)
//   //   .toString()
//   //   .slice(16, 21);
//   return new Date(ts).toTimeString().slice(0, 5);
// };

export default {
  name: "DailyWeather",
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

  mounted() {
    if (this.days.length === 0 && this.latlng) {
      this.getDailyForecast(this.latlng);
    }
  },

  activated() {
    if (this.days.length === 0 && this.latlng) {
      this.getDailyForecast(this.latlng);
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
    async getDailyForecast({ lat, lng }) {
      const data = await getDailyWeatherDataAPI({ lat, lng });
      const DAY_DATA_KEYS = new Set([
        "datetime",
        "avgTemp",
        "sunrise",
        "sunset",
        "rainingChance",
        "humidity",
        "uv",
        "weatherId"
      ]);

      const days = data.days.map((day) =>
        Object.fromEntries(
          Object.entries(day).filter((entry) => DAY_DATA_KEYS.has(entry[0]))
        )
      );

      for (const day of days) {
        day.datetime = new Date(day.datetime);
        day.avgTemp = kelvinsToCelsius(day.avgTemp);
        day.rainingChance = day.rainingChance * 100;
        if (day.weatherId) {
          const iconPath = "assets/icons/condition";
          const iconName = iconConfig[day.weatherId];
          const time = "day";

          day.weatherIcon = require(`@/${iconPath}/${time}/${iconName}`);
        }
      }

      this.days = days;
      this.setSelectedDay(this.currentDay);
    },

    setSelectedDay(day) {
      this.selectedDay = day;
    }
  },

  watch: {
    latlng() {
      this.getDailyForecast(this.latlng);
    }
  }
};
</script>
