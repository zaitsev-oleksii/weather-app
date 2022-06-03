<template>
  <div class="w-full relative">
    <input
      v-model="currentPlace"
      @input="handlePlacesInputChange"
      class="w-full"
      type="text"
      placeholder="Enter your city..."
      @keydown.enter="handleEnterClick"
    />
    <ul class="w-full z-10 absolute list-none" v-if="places.length > 0">
      <li
        class="w-full p-3 odd:bg-white even:bg-slate-100 border-x-2 border-b-2"
        v-for="(place, idx) of places"
        :key="idx"
        @click="handleAutocompleteClick(place)"
      >
        {{ place.placeName }}
      </li>
    </ul>
  </div>
  <div class="mt-10 z-0 relative">
    <LeafletMap
      :mapCenter="currentLocation"
      @location-chosen="handleChooseLoc"
    />
  </div>
</template>

<script>
import { getPlacesAutocompleteSuggestions } from "../api";

import LeafletMap from "./LeafletMap.vue";

export default {
  name: "LocationForm",
  components: { LeafletMap },
  data() {
    return {
      currentPlace: null,
      currentLocation: null,
      places: []
    };
  },

  emits: {
    "location-chosen": null
  },

  methods: {
    handleChooseLoc(loc) {
      this.currentLocation = loc;
      this.$emit("location-chosen", this.currentLocation);
      // this.getWeatherData(this.currentLocation);
      // const accessKey = "b3bf61092d27d5226ab2e2761b5ce245";
      // const { lat, lng } = this.currentLocation;
      // const reqURL = `http://api.positionstack.com/v1/reverse?access_key=${accessKey}&query=${lat},${lng}`;

      // const res = await fetch(reqURL).then((r) => r.json());
      // console.log(res);
      // const region = res.data[0].region;
      // this.currentCity = region;
    },

    async handlePlacesInputChange() {
      const prefix = this.currentPlace;
      if (!prefix) {
        this.clearSuggestions();
        return;
      }
      const autoCompleteSuggestions = await getPlacesAutocompleteSuggestions(
        prefix,
        5
      ).catch((err) => console.log(err));
      if (!autoCompleteSuggestions) {
        return;
      }
      this.places = autoCompleteSuggestions;
    },

    handleAutocompleteClick(place) {
      this.currentPlace = place.placeName;
      this.handleChooseLoc({ lat: place.lat, lng: place.lon });
      this.clearSuggestions();
    },

    async handleEnterClick() {
      const prefix = this.currentPlace;
      if (!prefix) {
        return;
      }
      const place = (await getPlacesAutocompleteSuggestions(prefix, 1))[0];
      console.log(place);
      this.handleChooseLoc({ lat: place.lat, lng: place.lon });
      this.clearSuggestions();
    },

    clearSuggestions() {
      console.log("clearSuggestions");
      this.places = [];
    }
  }
};
</script>
