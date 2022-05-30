<template>
  <div
    ref="hours"
    class="flex w-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
  >
    <div
      ref="hour"
      v-for="hour in hours"
      :key="hour"
      class="p-2 mx-1 snap-center bg-slate-300 rounded-md text-center"
      :class="{
        'bg-slate-400': new Date(hour.time).getHours() === currentHour
      }"
    >
      <h3>{{ hour.time.slice(-5) }}</h3>
      <img :src="hour.condition.icon" alt="weather" />
      <h3>{{ hour.temp_c }} °C</h3>
    </div>
  </div>
</template>

<script>
export default {
  name: "TodayWeather",
  data() {
    return {
      hours: []
    };
  },
  props: {
    latlng: Object
  },
  activated() {
    this.scrollToCurrentHour();
  },
  computed: {
    currentHour() {
      return new Date().getHours();
    },
    filteredHours() {
      return this.hours.filter(
        (hour) => new Date(hour.time).getHours() >= this.currentHour
      );
    }
  },
  methods: {
    async getTodayWeatherData({ lat, lng }) {
      // Weatherapi
      if (!(lat && lng)) {
        return;
      }
      const API_KEY = "42e19325d76941a898082725222805";
      const reqURL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lng}&days=1`;
      const fetchedData = await fetch(reqURL);
      const parsedData = await fetchedData
        .json()
        .then((r) => r.forecast.forecastday[0].hour);

      this.hours = parsedData;
      // console.log(parsedData);
    },
    scrollToCurrentHour() {
      if (!this.$refs.hour) {
        return;
      }
      this.$refs.hours.scrollLeft =
        this.$refs.hour[0].clientWidth * (this.currentHour - 3);
    }
  },
  watch: {
    latlng() {
      this.getTodayWeatherData(this.latlng);
    },
    hours() {
      this.$nextTick(() => {
        this.scrollToCurrentHour();
      });
    }
  }
};
</script>
