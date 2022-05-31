<template>
  <div class="w-full flex p-3 bg-slate-300 rounded-md">
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
  </div>
</template>

<script>
import { getCurrentWeatherData as getData } from "../api";

export default {
  name: "CurrentWeather",
  props: {
    latlng: Object
  },
  data() {
    return {
      place: "",
      currentTemp: undefined,
      feelsLikeTemp: undefined,
      imgSrc: "",
      datetime: "",
      text: ""
    };
  },
  mounted() {
    if (this.latlng) {
      this.getCurrentWeatherData(this.latlng);
    }
  },
  activated() {
    // if (this.latlng) {
    //   this.getCurrentWeatherData(this.latlng);
    // }
  },
  computed: {
    time() {
      return this.datetime.slice(-5);
    }
  },
  methods: {
    async getCurrentWeatherData({ lat, lng }) {
      const data = await getData({ lat, lng });
      this.imgSrc = data.imgSrc;
      this.datetime = data.datetime;
      this.currentTemp = data.currentTemp;
      this.text = data.text;
      this.feelsLikeTemp = data.feelsLikeTemp;
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
