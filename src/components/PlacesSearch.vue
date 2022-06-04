<template>
  <div class="relative w-full h-full bg-white" ref="searchBox">
    <input
      v-model="searchString"
      type="text"
      class="px-5 w-full h-full border-0 text-xl font-semibold"
      @keydown.enter="handleEnterClick"
    />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      class="absolute w-auto h-2/5 right-5 top-1/2 -translate-y-1/2"
      viewBox="0 0 16 16"
    >
      <path
        d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
      />
    </svg>
  </div>
  <template v-if="suggestions.length > 0">
    <div
      class="fixed top-0 left-0 z-[1100] w-screen h-screen bg-black opacity-50"
      @click="clearSuggestions"
    ></div>
  </template>
  <template v-if="suggestions.length > 0">
    <div
      class="fixed top-20 z-[1200] p-2 bg-custom-gunmetal rounded-2xl"
      :style="{
        left: suggestionsBoxOffsetX + 'px',
        width: suggestionsBoxWidth + 'px'
      }"
    >
      <div class="flex flex-col gap-2 w-full h-full">
        <div
          class="px-4 py-2 w-full text-left text-xl text-white bg-custom-dark-gunmetal rounded-xl"
          v-for="(suggestion, idx) in suggestions"
          :key="idx"
          @click="handleSuggestionClick(suggestion)"
        >
          {{ suggestion.placeName }}
        </div>
      </div>
    </div>
  </template>
</template>

<script setup>
import { getPlacesAutocompleteSuggestions } from "../api";
const SUGGESTION_KEYS = new Set(["placeName", "lat", "lng"]);

import { ref, watch, onMounted, onBeforeUnmount, defineEmits } from "vue";

const emit = defineEmits({ "location-chosen": null });

const searchString = ref("");
const suggestions = ref([]);

const suggestionsBoxOffsetX = ref(undefined);
const suggestionsBoxWidth = ref(undefined);

const searchBox = ref(null);

const calculateSuggestionsBoxPosition = () => {
  suggestionsBoxOffsetX.value = searchBox.value.getBoundingClientRect().x;
  suggestionsBoxWidth.value = searchBox.value.getBoundingClientRect().width;
};

onMounted(() => {
  calculateSuggestionsBoxPosition();
  window.addEventListener("resize", calculateSuggestionsBoxPosition);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", calculateSuggestionsBoxPosition);
});

const clearSuggestions = () => {
  suggestions.value = [];
};

const handleSuggestionClick = (suggestion) => {
  emit("location-chosen", { lat: suggestion.lat, lng: suggestion.lng });
  clearSuggestions();
};

const handleEnterClick = async () => {
  if (!searchString.value) {
    return;
  }
  const place = (
    await getPlacesAutocompleteSuggestions(searchString.value, 1)
  )[0];

  if (!(place?.lat && place.lng)) {
    return;
  }

  emit("location-chosen", { lat: place.lat, lng: place.lng });
  clearSuggestions();
};

watch(searchString, async () => {
  if (searchString.value === "") {
    clearSuggestions();
    return;
  }

  const autoCompleteData = await getPlacesAutocompleteSuggestions(
    searchString.value,
    5
  ).catch((err) => console.log(err));

  // console.log(autoCompleteSuggestions);
  if (!autoCompleteData) {
    return;
  }

  const autoCompleteSuggestions = autoCompleteData.map((suggestion) =>
    Object.fromEntries(
      Object.entries(suggestion).filter((entry) =>
        SUGGESTION_KEYS.has(entry[0])
      )
    )
  );

  suggestions.value = autoCompleteSuggestions;
});
</script>
