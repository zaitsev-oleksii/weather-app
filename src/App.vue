<template>
  <div class="container">
    <div
      class="sm:w-full md:w-2/5 lg:w-1/3 md:h-screen float-left p-8 md:shadow-lg"
    >
      <location-form @location-chosen="handleChooseLoc" />
      <div v-if="currentLocation" class="mt-10">
        <current-weather :latlng="currentLocation" />
      </div>
    </div>
    <div class="float-left sm:w-full md:w-3/5 lg:w-2/3 p-8">
      <div class="w-full flex gap-1">
        <button
          class="p-1 rounded-md text-lg font-semibold"
          @click="currentTab = 'TodayWeather'"
        >
          Today
        </button>
        <button
          class="p-1 rounded-md text-lg font-semibold"
          @click="currentTab = 'ForecastWeather'"
        >
          3 Days
        </button>
      </div>
      <div class="w-full">
        <div class="w-full mt-4">
          <keep-alive>
            <component
              :is="currentTab"
              :key="currentTab"
              :latlng="currentLocation"
            />
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LocationForm from "./components/LocationForm.vue";
import CurrentWeather from "./components/CurrentWeather.vue";
import TodayWeather from "./components/TodayWeather.vue";
import ForecastWeather from "./components/ForecastWeather.vue";

export default {
  name: "App",
  components: { LocationForm, CurrentWeather, TodayWeather, ForecastWeather },

  data() {
    return {
      currentLocation: null,
      currentTab: "TodayWeather"
    };
  },

  async created() {
    // const fetchedCities = await fetch(
    //   "http://geodb-free-service.wirefreethought.com/v1/geo/cities?namePrefix=Ky&types=CITY&sort=name&offset=0&limit=10"
    // );
    // const parsedCities = await fetchedCities.json();
    // this.cities = parsedCities.data.map((city) => city.name);
  },
  methods: {
    handleChooseLoc(loc) {
      this.currentLocation = loc;
      // this.getWeatherData(this.currentLocation);
      // const accessKey = "b3bf61092d27d5226ab2e2761b5ce245";
      // const { lat, lng } = this.currentLocation;
      // const reqURL = `http://api.positionstack.com/v1/reverse?access_key=${accessKey}&query=${lat},${lng}`;

      // const res = await fetch(reqURL).then((r) => r.json());
      // console.log(res);
      // const region = res.data[0].region;
      // this.currentCity = region;
    }
  }
};
</script>

<style src="./app.css"></style>
