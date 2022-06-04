<template>
  <div class="w-full h-full">
    <div class="float-left mt-3 pr-3 w-62/100 h-full" v-if="selectedHour">
      <weather-details
        :humidity="selectedHour.humidity"
        :windSpeed="selectedHour.windSpeed"
        :pressure="selectedHour.pressure"
        :cloudCover="selectedHour.cloudCover"
        :uv="selectedHour.uv"
      />
    </div>
    <div class="float-left mt-3 pl-3 w-38/100 h-full">
      <div class="p-3 w-full h-full rounded-3xl bg-custom-dark-gunmetal">
        <div
          class="flex flex-row gap-3 w-full h-full rounded-3xl overflow-x-auto snap-x snap-mandatory no-scrollbar"
          ref="hours"
        >
          <div
            class="flex flex-col shrink-0 basis-24 p-2 h-full text-center rounded-2xl bg-custom-gunmetal"
            :class="{
              'bg-custom-abbey': hour === selectedHour
            }"
            v-for="hour in hours"
            :key="hour"
            @click="setSelectedHour(hour)"
            ref="hour"
          >
            <span class="w-full text-white">{{
              (hour.datetime.getHours().toString().length === 1
                ? "0" + hour.datetime.getHours()
                : hour.datetime.getHours()) + ":00"
            }}</span>
            <span class="my-auto w-full"
              ><i class="bi bi-cloud text-white text-6xl"></i
            ></span>
            <span class="mt-auto mb-1 w-full">
              <span class="mt-auto text-3xl font-bold text-white">{{
                hour.temp.toFixed(0)
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
import { getHourlyWeatherData as getHourlyWeatherDataAPI } from "../api";

import WeatherDetails from "./WeatherDetails.vue";

const kelvinsToCelsius = (temp) => temp - 273.15;
const kpaToInhg = (pressure) => pressure * 0.02953;

export default {
  name: "TodayWeather",
  components: { WeatherDetails },

  data() {
    return {
      hours: [],
      selectedHour: null
    };
  },

  props: {
    latlng: Object
  },

  mounted() {
    if (this.latlng && this.hours.length === 0) {
      this.getHourlyWeatherData(this.latlng);
    }
  },

  activated() {
    if (this.latlng && this.hours.length === 0) {
      this.getHourlyWeatherData(this.latlng);
    }
    this.scrollToSelectedHour();
  },

  computed: {
    currentHour() {
      return this.hours.find(
        (hour) => hour.datetime.getHours() === new Date().getHours()
      );
    },
    filteredHours() {
      return this.hours.filter(
        (hour) => hour.datetime >= this.currentHour.datetime
      );
    }
  },

  methods: {
    async getHourlyWeatherData({ lat, lng }) {
      const data = await getHourlyWeatherDataAPI({ lat, lng });
      const HOUR_DATA_KEYS = new Set([
        "datetime",
        "temp",
        "humidity",
        "windSpeed",
        "pressure",
        "cloudCover",
        "uv",
        "rainingChance"
      ]);

      const hours = data.hours.map((hour) =>
        Object.fromEntries(
          Object.entries(hour).filter((entry) => HOUR_DATA_KEYS.has(entry[0]))
        )
      );
      for (const hour of hours) {
        hour.datetime = new Date(hour.datetime);
        hour.temp = kelvinsToCelsius(hour.temp);
        hour.pressure = kpaToInhg(hour.pressure);
      }

      this.hours = hours;
      this.setSelectedHour(this.currentHour);
    },

    scrollToSelectedHour() {
      if (!this.$refs.hour) {
        return;
      }
      this.$refs.hours.scrollLeft =
        this.$refs.hour[0].clientWidth *
        (this.selectedHour.datetime.getHours() + 2);
    },

    setSelectedHour(hour) {
      this.selectedHour = hour;
    }
  },

  watch: {
    latlng() {
      this.getHourlyWeatherData(this.latlng);
      // this.$nextTick().then(() => {
      //   this.scrollToSelectedHour();
      // });
    }
    // hours() {
    //   this.$nextTick().then(() => {
    //     this.scrollToSelectedHour();
    //   });
    // }
  }
};
</script>
