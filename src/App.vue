<template>
  <div class="container">
    <div class="w-2/3 h-screen px-10 py-5 mx-auto bg-custom-bunker">
      <div class="float-right mr-3 w-2/3 h-10 rounded-3xl overflow-hidden">
        <places-search @location-chosen="handleChooseLocation" />
      </div>
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
              @location-chosen="handleChooseLocation"
            />
          </div>
        </div>
        <div class="float-left w-7/12 px-5 h-full" v-if="currentLocation">
          <current-weather :latlng="currentLocation" />
        </div>
      </div>
      <template v-if="currentLocation">
        <div class="mt-20 px-5 w-full h-48">
          <span
            class="float-left ml-2 w-full text-2xl text-white font-semibold"
          >
            <span
              @click="setCurrentTab(tabs.today)"
              :class="{
                'opacity-60': currentTab !== tabs.today
              }"
              >Hourly</span
            >
            <span
              class="ml-5"
              @click="setCurrentTab(tabs.daily)"
              :class="{
                'opacity-60': currentTab !== tabs.daily
              }"
              >Daily</span
            >
          </span>
          <!-- <today-weather :latlng="currentLocation" /> -->
          <keep-alive>
            <component :is="currentTabComponent" :latlng="currentLocation" />
          </keep-alive>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
// import LocationForm from "./components/LocationForm.vue";
import PlacesSearch from "./components/PlacesSearch.vue";
import CurrentWeather from "./components/CurrentWeather.vue";
import TodayWeather from "./components/TodayWeather.vue";
import DailyWeather from "./components/DailyWeather.vue";
import LeafletMap from "./components/LeafletMap.vue";

import { computed, ref } from "vue";

import { getPlaceByLocation } from "./api";

const tabs = {
  today: "today",
  daily: "daily"
};

const tabComponents = {
  today: "TodayWeather",
  daily: "DailyWeather"
};

export default {
  name: "App",
  components: {
    PlacesSearch,
    CurrentWeather,
    TodayWeather,
    DailyWeather,
    LeafletMap
  },

  setup() {
    const currentLocation = ref(null);
    const currentLocationPlace = ref(null);
    const currentTab = ref(tabs.today);

    const currentTabComponent = computed(() => {
      return tabComponents[currentTab.value];
    });

    const setCurrentLocationPlace = async (loc) => {
      if (!currentLocation.value) {
        return;
      }
      currentLocationPlace.value = await getPlaceByLocation(loc);
    };

    const handleChooseLocation = (loc) => {
      currentLocation.value = loc;
      setCurrentLocationPlace(currentLocation.value);
    };

    const setCurrentTab = (tab) => {
      currentTab.value = tab;
    };

    return {
      currentLocation,
      currentLocationPlace,
      currentTab,
      handleChooseLocation,
      setCurrentTab,
      currentTabComponent,
      tabs
    };
  }
};
</script>

<style src="./app.css"></style>
