<template>
  <div class="flex flex-row">
    <div class="ml-auto mr-6 w-2/3 h-10">
      <places-search @location-chosen="handleChooseLocation" />
    </div>
    <div class="w-10 h-10">
      <router-link to="/settings"
        ><img :src="settingsIcon" alt=""
      /></router-link>
    </div>
  </div>
  <div class="flex flex-col lg:flex-row mt-14 w-full h-auto lg:h-64">
    <div class="w-full h-64 lg:h-full lg:w-5/12 px-5">
      <span
        class="inline-flex no-scrollbar pl-2 w-full whitespace-nowrap overflow-x-auto text-2xl text-white font-semibold"
        v-if="currentLocationPlace"
        >{{ currentLocationPlace.region }},
        {{ currentLocationPlace.country }}</span
      >
      <div class="mt-2 w-full h-full rounded-3xl overflow-hidden">
        <leaflet-map
          :mapCenter="currentLocation"
          @location-chosen="handleChooseLocation"
        />
      </div>
    </div>
    <div
      class="mt-14 lg:mt-0 w-full lg:w-7/12 px-5 h-64"
      v-if="currentLocation"
    >
      <current-weather :latlng="currentLocation" />
    </div>
  </div>
  <template v-if="currentLocation">
    <div class="flex flex-col mt-20 px-5 w-full h-48">
      <span class="flex flex-row ml-2 w-full text-2xl text-white font-semibold">
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
</template>

<script>
import PlacesSearch from "../components/PlacesSearch.vue";
import CurrentWeather from "../components/CurrentWeather.vue";
import TodayWeather from "../components/TodayWeather.vue";
import DailyWeather from "../components/DailyWeather.vue";
import LeafletMap from "../components/LeafletMap.vue";

import settingsIcon from "../assets/icons/gear.svg";

import { computed, ref } from "vue";

import { getPlaceByLocation } from "../api";

const tabs = {
  today: "today",
  daily: "daily"
};

const tabComponents = {
  today: "TodayWeather",
  daily: "DailyWeather"
};

export default {
  name: "MainView",
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
      tabs,
      settingsIcon
    };
  }
};
</script>

<style></style>
