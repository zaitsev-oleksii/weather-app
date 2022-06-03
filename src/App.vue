<template>
  <div class="container">
    <div class="w-2/3 h-screen px-10 py-5 mx-auto bg-custom-bunker">
      <div class="float-right mr-3 w-2/3 h-10 p-2 rounded-3xl bg-white"></div>
      <div class="mt-14 w-full h-64">
        <div class="float-left h-full w-5/12 px-5">
          <span
            class="ml-2 w-full text-2xl text-white font-semibold"
            v-if="currentLocationPlace"
            >{{ currentLocationPlace.name }},
            {{ currentLocationPlace.country }}</span
          >
          <div class="mt-2 w-full h-full rounded-3xl overflow-hidden">
            <leaflet-map
              :mapCenter="currentLocation"
              @location-chosen="handleChooseLoc"
            />
          </div>
        </div>
        <div class="float-left w-7/12 px-5 h-full" v-if="currentLocation">
          <current-weather :latlng="currentLocation" />
        </div>
      </div>
      <template v-if="currentLocation">
        <div class="mt-14 px-5 w-full h-48">
          <span class="float-left ml-2 w-full text-2xl text-white font-semibold"
            >Hourly</span
          >
          <today-weather :latlng="currentLocation" />
        </div>
      </template>
    </div>
  </div>
  <!-- <div class="container">
    <div
      class="sm:w-full md:w-2/5 lg:w-1/3 md:h-screen float-left p-8 md:shadow-lg"
    >
      <location-form @location-chosen="handleChooseLoc" />
      <div v-if="currentLocation" class="mt-10">
        <current-weather :latlng="currentLocation" />
      </div>
    </div>
    <div
      class="float-left flex flex-col sm:w-full md:w-3/5 md:h-screen lg:w-2/3 p-8 overflow-y-auto no-scrollbar"
    >
      <div class="w-full flex gap-1">
        <button
          class="p-1 rounded-md text-xl font-semibold"
          :class="{
            'opacity-50': currentTab !== tabs.today
          }"
          @click="setCurrentTab(tabs.today)"
        >
          Today
        </button>
        <button
          class="p-1 rounded-md text-xl font-semibold"
          :class="{
            'opacity-50': currentTab !== tabs.forecast
          }"
          @click="setCurrentTab(tabs.forecast)"
        >
          3 Days
        </button>
      </div>
      <div class="w-full">
        <div class="w-full mt-4" v-if="currentLocation">
          <keep-alive>
            <component :is="currentTabComponent" :latlng="currentLocation" />
          </keep-alive>
        </div>
      </div>
    </div>
  </div> -->
</template>

<script>
/* eslint-disable */
import LocationForm from "./components/LocationForm.vue";
import CurrentWeather from "./components/CurrentWeather.vue";
import TodayWeather from "./components/TodayWeather.vue";
import ForecastWeather from "./components/ForecastWeather.vue";
import LeafletMap from "./components/LeafletMap.vue";

import { computed, ref } from "vue";

import { getPlaceByLocation } from "./api";

const tabs = {
  today: "today",
  forecast: "forecast"
};

const tabComponents = {
  today: "TodayWeather",
  forecast: "ForecastWeather"
};

export default {
  name: "App",
  components: {
    LocationForm,
    CurrentWeather,
    TodayWeather,
    ForecastWeather,
    LeafletMap
  },

  setup() {
    const currentLocation = ref(null);
    const currentLocationPlace = ref(null);
    const currentTab = ref("today");

    const currentTabComponent = computed(() => {
      return tabComponents[currentTab.value];
    });

    const setCurrentLocationPlace = async (loc) => {
      if (!currentLocation.value) {
        return;
      }
      currentLocationPlace.value = await getPlaceByLocation(loc);
      
      // console.log(currentLocationPlace);
    };

    const handleChooseLoc = (loc) => {
      // console.log(loc);
      currentLocation.value = loc;
      setCurrentLocationPlace(currentLocation.value);
      // console.log(currentLocation.value);
    };
    const setCurrentTab = (tab) => {
      console.log(tab);
      currentTab.value = tab;
    };

    return {
      currentLocation,
      currentLocationPlace,
      currentTab,
      handleChooseLoc,
      setCurrentTab,
      currentTabComponent,
      tabs
    };
  }
};
</script>

<style src="./app.css"></style>
