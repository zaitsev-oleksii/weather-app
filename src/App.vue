<template>
  <div class="container">
    <div
      class="sm:w-full md:w-2/5 lg:w-1/3 md:h-screen float-left p-8 md:shadow-lg"
    >
      <div class="w-full relative">
        <input
          v-model="currentCity"
          @input="handleCitiesInputChange"
          class="w-full"
          type="text"
          placeholder="Enter your city..."
        />
        <ul class="w-full z-10 absolute list-none" v-if="cities.length > 0">
          <li
            class="w-full p-3 odd:bg-white even:bg-slate-100 border-x-2 border-b-2"
            v-for="(city, idx) of cities"
            :key="idx"
            @click="handleAutocompleteClick(city)"
          >
            {{ city }}
          </li>
        </ul>
      </div>
      <div class="mt-10 z-0 relative">
        <LeafletMap @location-chosen="handleChooseLoc" />
      </div>
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
          @click="currentTab = 'CurrentWeather'"
        >
          Current
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
import LeafletMap from "./components/LeafletMap.vue";
import CurrentWeather from "./components/CurrentWeather.vue";
import TodayWeather from "./components/TodayWeather.vue";

export default {
  name: "App",
  components: { LeafletMap, CurrentWeather, TodayWeather },

  data() {
    return {
      currentCity: "",
      cities: [],
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
    },
    async handleCitiesInputChange() {
      const prefix = this.currentCity;
      if (!prefix) {
        this.cities = [];
        return;
      }
      const accessToken = "pk.c4c504420e844b45f50ec36aa44e6098";
      // const fetchedCities = await fetch(
      //   `http://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=5&offset=0&namePrefix=${prefix}`
      // );
      const fetchedCities = await fetch(
        `https://api.locationiq.com/v1/autocomplete.php?key=${accessToken}&q=${prefix}`
      );
      const parsedCities = await fetchedCities.json();
      // console.log(parsedCities);
      // console.log(parsedCities);
      if ("error" in parsedCities) {
        return;
      }
      this.cities = parsedCities.map((place) => place.address.name).slice(0, 5);
    },
    handleAutocompleteClick(city) {
      this.currentCity = city;
    }
  }
};
</script>

<style src="./app.css"></style>
