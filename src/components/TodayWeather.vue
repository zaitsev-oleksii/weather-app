<template>
  <div class="flex flex-col xl:flex-row w-full xl:h-full">
    <div
      class="order-last xl:order-first mt-3 w-full xl:w-62/100 h-44 xl:h-full"
      v-if="selectedHour"
    >
      <weather-details
        :humidity="selectedHour.humidity"
        :windSpeed="selectedHour.windSpeed"
        :pressure="selectedHour.pressure"
        :cloudCover="selectedHour.cloudCover"
        :uv="selectedHour.uv"
      />
    </div>
    <div
      class="order-first xl:order-last mt-3 xl:pl-6 w-full xl:w-38/100 h-44 xl:h-full"
    >
      <div class="p-3 w-full h-full rounded-3xl bg-custom-dark-gunmetal">
        <div
          class="flex flex-row gap-3 w-full h-full rounded-3xl overflow-x-auto snap-x snap-mandatory no-scrollbar"
        >
          <div
            class="flex flex-col shrink-0 basis-24 p-2 h-full text-center rounded-2xl bg-custom-gunmetal"
            :class="{
              'bg-custom-abbey': hour?.datetime === selectedHour?.datetime
            }"
            v-for="hour in displayedHours"
            :key="hour"
            @click="setSelectedHour(hour)"
          >
            <span class="w-full text-white">{{ hour.time }}</span>
            <span class="my-auto w-full"
              ><img :src="hour.weatherIcon" alt=""
            /></span>
            <span class="mt-auto mb-1 w-full">
              <span class="mt-auto text-3xl font-bold text-white">{{
                hour.temp.toFixed(0)
              }}</span>
              <span class="align-top font-bold text-white"
                >°
                <span
                  v-if="
                    tempPreference === preferencesConfig.temperature.celsius
                  "
                  >C</span
                >
                <span
                  v-if="
                    tempPreference === preferencesConfig.temperature.fahrenheit
                  "
                  >F</span
                ></span
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

import { getHourlyWeatherData as getHourlyWeatherDataAPI } from "../api";

import {
  weatherConditionIconConfig as iconConfig,
  preferencesConfig
} from "../config";

import WeatherDetails from "./WeatherDetails.vue";

import { kelvinsToPreferredTemp } from "../helpers";

// const kpaToInhg = (pressure) => pressure * 0.02953;

const getWeatherIconPath = (weatherId, datetime, sunrise, sunset) => {
  if (!weatherId) return;

  const iconPath = "assets/icons/condition";
  const iconName = iconConfig[weatherId];
  const time = sunrise < datetime && datetime < sunset ? "day" : "night";

  return require(`@/${iconPath}/${time}/${iconName}`);
};

export default {
  name: "TodayWeather",
  components: { WeatherDetails },

  setup() {
    const store = useStore();

    const hoursData = ref([]);
    const selectedHour = ref(null);
    const sunrise = ref(undefined);
    const sunset = ref(undefined);

    onMounted(() => {
      if (currentLocation.value && hoursData.value.length === 0) {
        getHourlyWeatherData(currentLocation.value).then(() =>
          setSelectedHour(currentHour.value)
        );
      }
    });

    onActivated(() => {
      if (currentLocation.value && hoursData.value.length === 0) {
        getHourlyWeatherData(currentLocation.value).then(() =>
          setSelectedHour(currentHour.value)
        );
      }
    });

    const currentHour = computed(() => {
      return displayedHours.value.find(
        (hour) => new Date(hour.datetime).getHours() === new Date().getHours()
      );
    });

    const currentLocation = computed(() => store.state.location);
    const tempPreference = computed(() => store.state.tempPreference);

    const displayedHours = computed(() => {
      return hoursData.value.map((hour) => {
        const timeStr = new Date(hour.datetime).getHours().toString();
        return {
          ...hour,
          time: timeStr.length === 1 ? "0" + timeStr : timeStr + ":00",
          temp: kelvinsToPreferredTemp(hour.temp, tempPreference.value),
          weatherIcon:
            getWeatherIconPath(
              hour.weatherId,
              hour.datetime,
              sunrise,
              sunset
            ) ?? ""
        };
      });
    });

    const getHourlyWeatherData = async ({ lat, lng }) => {
      const data = await getHourlyWeatherDataAPI({ lat, lng });
      const HOUR_DATA_KEYS = new Set([
        "id",
        "datetime",
        "temp",
        "humidity",
        "windSpeed",
        "pressure",
        "cloudCover",
        "uv",
        "rainingChance",
        "weatherId"
      ]);

      sunrise.value = new Date(data.sunrise);
      sunset.value = new Date(data.sunset);

      const hoursFromRes = data.hours.map((hour) =>
        Object.fromEntries(
          Object.entries(hour).filter((entry) => HOUR_DATA_KEYS.has(entry[0]))
        )
      );

      hoursData.value = hoursFromRes;
    };

    const setSelectedHour = (hour) => {
      selectedHour.value = hour;
    };

    watch(currentLocation, () => {
      getHourlyWeatherData(currentLocation.value).then(() =>
        setSelectedHour(currentHour.value)
      );
    });

    return {
      displayedHours,
      selectedHour,
      preferencesConfig,
      setSelectedHour,
      tempPreference
    };
  }
};
</script>
