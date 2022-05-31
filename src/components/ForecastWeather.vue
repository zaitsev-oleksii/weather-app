<template>
  <div
    ref="hours"
    class="flex gap-1 w-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
  >
    <div
      ref="hour"
      v-for="day in days"
      :key="day"
      class="p-2 w-36 snap-center bg-slate-300 rounded-md text-center"
      :class="{
        'bg-slate-400': day.datetime === currentDate
      }"
    >
      <h3>
        {{ day.datetime.toDateString() }}
      </h3>
      <img :src="day.imgSrc" alt="weather" />
      <h3>min: {{ day.minTemp }}, max: {{ day.maxTemp }} °C</h3>
    </div>
  </div>
</template>

<script>
import { getForecastWeatherData as getData } from "../api";

export default {
  name: "ForecastWeather",
  data() {
    return {
      days: []
    };
  },
  props: {
    latlng: Object
  },
  activated() {
    if (this.days.length === 0 && this.latlng) {
      this.getForecastWeatherData(this.latlng);
    }
    this.scrollToCurrentDay();
  },
  computed: {
    currentDate() {
      return new Date();
    }
  },
  methods: {
    async getForecastWeatherData({ lat, lng }) {
      const data = await getData({ lat, lng });
      this.days = data;
      // console.log(data);
    },
    scrollToCurrentDay() {
      if (!this.$refs.hour) {
        return;
      }
      this.$refs.hours.scrollLeft =
        this.$refs.hour[0].clientWidth * (this.currentHour - 4);
    }
  },
  watch: {
    latlng() {
      this.getForecastWeatherData(this.latlng);
    },
    days() {
      this.$nextTick(() => {
        this.scrollToCurrentDay();
      });
    }
  }
};
</script>
