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
  <!-- <span class="text-2xl">Today's Highlights</span>
  <div class="flex flex-wrap justify-around gap-7 w-full mt-5 p-5">
    <weather-details
      :aqi="todayAQI ? Math.max(...Object.values(todayAQI)) : undefined"
      :sunrise="sunrise"
      :sunset="sunset"
      :minTemp="minTemp"
      :maxTemp="maxTemp"
    />
  </div>

  <span class="text-2xl mt-10">Hourly</span>
  <div
    ref="hours"
    class="flex gap-1 w-full mt-5 overflow-x-auto snap-x snap-mandatory no-scrollbar"
  >
    <div
      ref="hour"
      v-for="(hour, idx) in hours"
      :key="hour"
      class="p-2 w-20 snap-center bg-slate-300 rounded-md text-center"
      :class="{
        'bg-slate-400': hour === selectedHour,
        'ml-auto': idx === 0,
        'mr-auto': idx === hours.length - 1
      }"
      @click="setSelectedHour(hour)"
    >
      <h3>
        {{
          (hour.datetime.getHours().toString().length === 1
            ? "0" + hour.datetime.getHours()
            : hour.datetime.getHours()) + ":00"
        }}
      </h3>
      <img :src="hour.imgSrc" alt="weather" />
      <h3>{{ hour.temp }} °C</h3>
    </div>
  </div>

  <div
    class="flex flex-wrap justify-around gap-7 w-full mt-5 p-5"
    v-if="selectedHour"
  >
    <weather-details
      :humidity="selectedHour.humidity"
      :windSpeed="selectedHour.windSpeed"
      :windDegree="selectedHour.windDegree"
      :pressure="selectedHour.pressure"
      :cloudCover="selectedHour.cloudCover"
      :uv="selectedHour.uv"
      :rainingChance="selectedHour.rainingChance"
    />
  </div> -->
</template>

<script>
import { getTodayWeatherData as getData } from "../api";

import WeatherDetails from "./WeatherDetails.vue";

export default {
  name: "TodayWeather",
  components: { WeatherDetails },
  data() {
    return {
      hours: [],
      selectedHour: null,
      todayAQI: null,
      sunrise: "",
      sunset: "",
      minTemp: undefined,
      maxTemp: undefined
    };
  },
  props: {
    latlng: Object
  },
  mounted() {
    if (this.latlng) {
      this.getTodayWeatherData(this.latlng);
    }
  },
  activated() {
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
    async getTodayWeatherData({ lat, lng }) {
      const data = await getData({ lat, lng });
      const HOUR_DATA_KEYS = new Set([
        "imgSrc",
        "datetime",
        "temp",
        "humidity",
        "windSpeed",
        "windDegree",
        "pressure",
        "cloudCover",
        "uv",
        "rainingChance"
      ]);
      // IDK IF NEEDED
      this.hours = data.hours.map((hour) =>
        Object.fromEntries(
          Object.entries(hour).filter((entry) => HOUR_DATA_KEYS.has(entry[0]))
        )
      );
      // this.hours = data.hours;
      this.todayAQI = {
        pm2_5: data.aqi.pm2_5.toPrecision(1),
        pm10: data.aqi.pm10.toPrecision(1)
      };
      this.sunrise = data.sunrise;
      this.sunset = data.sunset;
      this.minTemp = data.minTemp;
      this.maxTemp = data.maxTemp;
      // console.log(data);
      this.setSelectedHour(this.currentHour);
    },
    scrollToSelectedHour() {
      if (!this.$refs.hour) {
        return;
      }
      this.$refs.hours.scrollLeft =
        this.$refs.hour[0].clientWidth * this.selectedHour.datetime.getHours();
    },
    setSelectedHour(hour) {
      this.selectedHour = hour;
    }
  },
  watch: {
    latlng() {
      this.getTodayWeatherData(this.latlng);
      this.scrollToSelectedHour();
    },
    hours() {
      this.$nextTick(() => {
        this.scrollToSelectedHour();
      });
    }
  }
};
</script>
