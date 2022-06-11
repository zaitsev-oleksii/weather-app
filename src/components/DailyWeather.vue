<template>
  <div class="flex flex-col lg:flex-row w-full lg:h-full">
    <div
      class="order-last lg:order-first mt-3 w-full lg:w-62/100 h-44 lg:h-full"
      v-if="selectedDay"
    >
      <weather-details
        :humidity="selectedDay.humidity"
        :sunrise="selectedDay.sunrise"
        :sunset="selectedDay.sunset"
        :rainingChance="selectedDay.rainingChance"
        :uv="selectedDay.uv"
      />
    </div>
    <div
      class="order-first lg:order-last mt-3 lg:pl-6 w-full lg:w-38/100 h-44 lg:h-full"
    >
      <div class="p-3 w-full h-full rounded-3xl bg-custom-dark-gunmetal">
        <div
          class="flex flex-row gap-3 w-full h-full rounded-3xl overflow-x-auto snap-x snap-mandatory no-scrollbar"
          ref="hours"
        >
          <div
            class="flex flex-col shrink-0 basis-24 p-2 h-full text-center rounded-2xl bg-custom-gunmetal"
            :class="{
              'bg-custom-abbey': day?.datetime === selectedDay?.datetime
            }"
            v-for="day in displayedDays"
            :key="day"
            @click="setSelectedDay(day)"
            ref="hour"
          >
            <span class="w-full text-azureish-white">{{
              day.datetime.toDateString().slice(0, 4)
            }}</span>
            <span class="my-auto w-full"
              ><img :src="day.weatherIcon" alt=""
            /></span>
            <span class="mt-auto mb-1 w-full">
              <span class="mt-auto text-3xl font-bold text-azureish-white">{{
                day.avgTemp.toFixed(0)
              }}</span>
              <span class="align-top font-bold text-azureish-white"
                >°{{ displayedTempUnit }}</span
              >
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onActivated } from "vue";
import { useStore } from "vuex";

import { getDailyWeatherData as getDailyWeatherDataAPI } from "../api";

import {
  weatherConditionIconConfig as iconConfig,
  preferencesConfig,
  displayedUnits
} from "../config";

import WeatherDetails from "./WeatherDetails.vue";

import { kelvinsToPreferredTemp } from "../helpers";

const getWeatherIconPath = (weatherId) => {
  if (!weatherId) return;

  const iconPath = "assets/icons/condition";
  const iconName = iconConfig[weatherId];
  const time = "day";

  return require(`@/${iconPath}/${time}/${iconName}`);
};

export default {
  name: "DailyWeather",
  components: { WeatherDetails },

  setup() {
    const store = useStore();
    const currentLocation = computed(() => store.state.location);
    const tempPreference = computed(() => store.state.preferences.temperature);
    const displayedTempUnit = computed(
      () => displayedUnits["temperature"][tempPreference.value]
    );

    const daysData = ref([]);
    const selectedDay = ref(null);

    onMounted(() => {
      if (currentLocation.value && daysData.value.length === 0) {
        getDailyForecast(currentLocation.value).then(() =>
          setSelectedDay(currentDay.value)
        );
      }
    });

    onActivated(() => {
      if (currentLocation.value && daysData.value.length === 0) {
        getDailyForecast(currentLocation.value).then(() =>
          setSelectedDay(currentDay.value)
        );
      }
    });

    const displayedDays = computed(() => {
      return daysData.value.map((day) => ({
        ...day,
        datetime: new Date(day.datetime),
        avgTemp: kelvinsToPreferredTemp(day.avgTemp, tempPreference.value),
        weatherIcon: getWeatherIconPath(day.weatherId) ?? ""
      }));
    });

    const currentDay = computed(() => {
      return displayedDays.value.find(
        (day) => day.datetime.toDateString() === new Date().toDateString()
      );
    });

    const getDailyForecast = async ({ lat, lng }) => {
      const data = await getDailyWeatherDataAPI({ lat, lng });
      const DAY_DATA_KEYS = new Set([
        "datetime",
        "avgTemp",
        "sunrise",
        "sunset",
        "rainingChance",
        "humidity",
        "uv",
        "weatherId"
      ]);

      const days = data.days.map((day) =>
        Object.fromEntries(
          Object.entries(day).filter((entry) => DAY_DATA_KEYS.has(entry[0]))
        )
      );

      daysData.value = days;
    };

    const setSelectedDay = (day) => {
      selectedDay.value = day;
    };

    watch(currentLocation, () =>
      getDailyForecast(currentLocation.value).then(() =>
        setSelectedDay(currentDay.value)
      )
    );

    return {
      displayedDays,
      selectedDay,
      setSelectedDay,
      tempPreference,
      displayedTempUnit,
      preferencesConfig
    };
  }
};
</script>
