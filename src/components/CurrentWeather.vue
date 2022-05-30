<template>
  <div class="w-full h-36 p-3 bg-slate-300 rounded-md">
    <div class="w-1/2 float-left flex flex-col">
      <img :src="imgSrc" alt="" class="ml-1 w-16 h-16" />
      <span class="ml-2 text-left font-semibold text-lg">{{ text }}</span>
      <span class="ml-2 text-left">{{ time }}</span>
    </div>
    <div class="w-1/2 float-right p-2 flex flex-col">
      <span class="text-right font-bold text-5xl">{{ currentTemp }}°</span>
      <span class="text-right text-md mt-4"
        >Feels like {{ feelsLikeTemp }}°
      </span>
    </div>
  </div>
</template>

<script>
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
      // Openweather
      // const API_KEY = "f88d5cc2fbae75f7dfa60fd059792f0c";
      // const reqURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&appid=${API_KEY}`;
      // Weatherapi
      if (!(lat && lng)) {
        return;
      }
      const API_KEY = "42e19325d76941a898082725222805";
      const reqURL = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lng}`;
      const fetchedData = await fetch(reqURL);
      const parsedData = await fetchedData.json().then((r) => r.current);
      this.imgSrc = parsedData.condition.icon;
      this.datetime = parsedData.last_updated;
      this.currentTemp = parsedData.temp_c;
      this.text = parsedData.condition.text;
      this.feelsLikeTemp = parsedData.feelslike_c;
      console.log(parsedData);
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
