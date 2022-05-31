<template>
  <div
    ref="hours"
    class="flex gap-1 w-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
  >
    <div
      ref="hour"
      v-for="hour in hours"
      :key="hour"
      class="p-2 w-16 snap-center bg-slate-300 rounded-md text-center"
      :class="{
        'bg-slate-400': hour === selectedHour
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

  <!-- SELECTED HOUR -->
  <div class="flex gap-7 w-full mt-5 bg-slate-300 p-5" v-if="selectedHour">
    <div class="w-36 h-36 p-3 bg-slate-400 rounded-md">
      <div class="float-left flex flex-col w-3/4">
        <span class="text-md text-slate-800">Humidity</span>
        <span class="text-4xl mt-3 font-semibold"
          >{{ selectedHour.humidity }}%</span
        >
      </div>
      <div
        class="relative float-left w-1/4 h-full rounded-md border-gray-800 border-2"
      >
        <div
          class="absolute bottom-0 bg-blue-700 w-full rounded-b-md"
          :class="{
            'rounded-t-md': selectedHour.humidity === 100
          }"
          :style="{
            height: selectedHour.humidity + '%'
          }"
        ></div>
      </div>
    </div>
    <div class="relative w-36 h-36 bg-slate-400 rounded-md">
      <div class="float-left p-3 flex flex-col w-3/4">
        <span class="text-md text-slate-800">Wind</span>
        <span class="text-3xl mt-3 font-semibold"
          >{{ selectedHour.windSpeed }} km/h</span
        >
      </div>
      <div class="absolute right-1 top-1/4 w-1/2 h-1/2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          class="bi bi-arrow-up opacity-20"
          :style="{
            transform: `rotate(${selectedHour.windDegree}deg)`
          }"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"
          />
        </svg>
      </div>
    </div>
    <div class="relative w-36 h-36 bg-slate-400 rounded-md">
      <div class="float-left p-3 flex flex-col w-3/4">
        <span class="text-md text-slate-800">Pressure</span>
        <span class="text-3xl mt-3 font-semibold"
          >{{ selectedHour.pressure }} in</span
        >
      </div>
    </div>
    <div class="relative w-36 h-36 bg-slate-400 rounded-md">
      <div class="float-left p-3 flex flex-col w-3/4">
        <span class="text-md text-slate-800">Cloud</span>
        <span class="text-3xl mt-3 font-semibold"
          >{{ selectedHour.cloudCover }}%</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getTodayWeatherData as getData } from "../api";

export default {
  name: "TodayWeather",
  data() {
    return {
      hours: [],
      selectedHour: null
    };
  },
  props: {
    latlng: Object
  },
  activated() {
    this.scrollToSelectedHour();
  },
  computed: {
    currentHour() {
      return this.hours.find(
        (hour) => hour.datetime.getHours() === new Date().getHours()
      );
    }
  },
  methods: {
    async getTodayWeatherData({ lat, lng }) {
      const data = await getData({ lat, lng });
      this.hours = data;
      // console.log(data);
      this.setSelectedHour(this.currentHour);
    },
    scrollToSelectedHour() {
      if (!this.$refs.hour) {
        return;
      }
      this.$refs.hours.scrollLeft =
        this.$refs.hour[0].clientWidth *
        (this.selectedHour.datetime.getHours() - 4);
    },
    setSelectedHour(hour) {
      this.selectedHour = hour;
    }
  },
  watch: {
    latlng() {
      this.getTodayWeatherData(this.latlng);
    },
    hours() {
      this.$nextTick(() => {
        this.scrollToSelectedHour();
      });
    }
  }
};
</script>
