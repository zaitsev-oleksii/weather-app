<template>
  <div class="flex flex-row gap-4 shrink-0 basis-24 w-full h-full">
    <weather-detail-card v-if="humidity">
      <template #title> Humidity </template>
      <template #value> {{ humidity }}% </template>
      <template #icon
        ><img :src="icons.humidityIcon" alt="" class="w-full h-full"
      /></template>
    </weather-detail-card>

    <weather-detail-card v-if="windSpeed">
      <template #title> Wind </template>
      <template #value> {{ windSpeed }}</template>
      <template #icon
        ><img :src="icons.windIcon" alt="" class="w-full h-full"
      /></template>
    </weather-detail-card>

    <weather-detail-card v-if="pressure">
      <template #title> Pressure </template>
      <template #value> {{ pressure.toFixed(0) }} in</template>
      <template #icon
        ><img :src="icons.pressureIcon" alt="" class="w-full h-full"
      /></template>
    </weather-detail-card>

    <weather-detail-card v-if="cloudCover">
      <template #title> Cloud </template>
      <template #value> {{ cloudCover }}% </template>
      <template #icon
        ><img :src="icons.cloudIcon" alt="" class="w-full h-full"
      /></template>
    </weather-detail-card>

    <weather-detail-card v-if="uv">
      <template #title> UV </template>
      <template #value> {{ uv }}</template>
      <template #icon
        ><img :src="icons.uvIcon" alt="" class="w-full h-full"
      /></template>
    </weather-detail-card>
  </div>
  <!-- <weather-detail-card
    :config="wdCardConfig.twoValues"
    v-if="minTemp && maxTemp"
  >
    <template #title> Min and max temp </template>
    <template #firstValue>
      <img :src="icons.tempLowIcon" alt="" class="mt-2 w-5 h-5" />
      <span class="text-2xl font-semibold">&nbsp;{{ minTemp }} °C</span>
    </template>
    <template #secondValue>
      <img :src="icons.tempHighIcon" alt="" class="mt-2 w-5 h-5" />
      <span class="text-2xl font-semibold">&nbsp;{{ maxTemp }} °C</span>
    </template>
  </weather-detail-card>

  <weather-detail-card :config="wdCardConfig.custom" v-if="humidity">
    <template #layout>
      <div class="float-left flex flex-col w-3/4">
        <span class="text-md text-slate-800">Humidity</span>
        <span class="text-4xl mt-3 font-semibold">{{ humidity }}%</span>
      </div>
      <div
        class="relative float-left w-1/4 h-full rounded-md border-gray-800 border-2"
      >
        <div
          class="absolute bottom-0 bg-blue-700 w-full rounded-b-md"
          :class="{
            'rounded-t-md': humidity === 100
          }"
          :style="{
            height: humidity + '%'
          }"
        ></div>
      </div>
    </template>
  </weather-detail-card>

  <weather-detail-card :config="wdCardConfig.oneValue" v-if="windSpeed">
    <template #title>Wind</template>
    <template #value>{{ windSpeed }}</template>
    <template #icon>
      <img
        :src="icons.arrowIcon"
        alt=""
        :style="{
          transform: `rotate(${windDegree}deg)`
        }"
      />
    </template>
  </weather-detail-card>

  <weather-detail-card :config="wdCardConfig.oneValue" v-if="pressure">
    <template #title>Pressure</template>
    <template #value>{{ pressure }} in</template>
  </weather-detail-card>

  <weather-detail-card :config="wdCardConfig.oneValue" v-if="cloudCover">
    <template #title>Cloud</template>
    <template #value>{{ cloudCover }}%</template>
    <template #icon>
      <img :src="icons.cloudIcon" alt="" />
    </template>
  </weather-detail-card>

  <weather-detail-card :config="wdCardConfig.oneValue" v-if="aqi">
    <template #title>AQI</template>
    <template #value>{{ aqi }}</template>
  </weather-detail-card>

  <weather-detail-card :config="wdCardConfig.oneValue" v-if="uv">
    <template #title>UV</template>
    <template #value>{{ uv }}</template>
  </weather-detail-card>

  <weather-detail-card
    :config="wdCardConfig.twoValues"
    v-if="sunrise || sunset"
  >
    <template #title>Sunrise & Sunset</template>
    <template #firstValue v-if="sunrise">
      <img :src="icons.sunriseIcon" alt="" class="mt-2 w-5 h-5" />
      <span class="text-2xl font-semibold">&nbsp;{{ sunrise }}</span>
    </template>
    <template #secondValue v-if="sunset">
      <img :src="icons.sunsetIcon" alt="" class="mt-2 w-5 h-5" />
      <span class="text-2xl font-semibold">&nbsp;{{ sunset }}</span>
    </template>
  </weather-detail-card>

  <weather-detail-card :config="wdCardConfig.oneValue" v-if="rainingChance">
    <template #title>Chance of rain</template>
    <template #value>{{ rainingChance }}%</template>
    <template #icon>
      <img :src="icons.rainIcon" alt="" />
    </template>
  </weather-detail-card> -->
</template>

<script>
import WeatherDetailCard from "./WeatherDetailCard.vue";

import humidityIcon from "../assets/icons/humidity.svg";
import windIcon from "../assets/icons/wind.svg";
import pressureIcon from "../assets/icons/pressure.svg";
import cloudIcon from "../assets/icons/cloudness.svg";
import uvIcon from "../assets/icons/uv.svg";

const icons = {
  humidityIcon,
  windIcon,
  pressureIcon,
  cloudIcon,
  uvIcon
};

const wdCardConfig = {
  oneValue: "oneValue",
  twoValues: "twoValues",
  custom: "custom"
};

export default {
  name: "WeatherDetails",
  components: { WeatherDetailCard },
  props: {
    humidity: Number,
    windSpeed: Number,
    windDegree: Number,
    pressure: Number,
    cloudCover: Number,
    aqi: Number,
    uv: Number,
    sunrise: String,
    sunset: String,
    rainingChance: Number,
    minTemp: Number,
    maxTemp: Number
  },
  setup() {
    return {
      icons,
      wdCardConfig
    };
  }
};
</script>
