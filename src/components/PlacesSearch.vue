<template>
  <div
    class="relative w-full h-full rounded-3xl overflow-hidden bg-azureish-white"
    ref="searchBox"
  >
    <input
      v-if="suggestions.length === 0"
      v-model="searchString"
      type="text"
      class="px-5 w-full h-full border-0 text-xl font-semibold bg-azureish-white"
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
      class="fixed h-36 bg-azureish-white z-[1300] rounded-3xl overflow-hidden"
      :style="{
        left: searchInputBoxOffsetX + 'px',
        top: searchInputBoxOffsetY + 'px',
        width: searchInputBoxWidth + 'px',
        height: searchInputBoxHeight + 'px'
      }"
    >
      <input
        v-model="searchString"
        type="text"
        class="px-5 w-full h-full border-0 text-xl font-semibold bg-azureish-white"
        @keydown.enter="handleEnterClick"
        @keydown.tab="catchFocus"
        ref="searchInput"
      />
    </div>
    <div
      class="fixed top-20 z-[1200] p-2 bg-custom-gunmetal rounded-2xl"
      :style="{
        left: suggestionsBoxOffsetX + 'px',
        top: suggestionsBoxOffsetY + 'px',
        width: suggestionsBoxWidth + 'px'
      }"
    >
      <div class="flex flex-col gap-2 w-full h-full">
        <div
          class="px-4 py-2 w-full text-left text-xl text-azureish-white bg-custom-dark-gunmetal rounded-xl hover:cursor-pointer"
          tabindex="1"
          v-for="(suggestion, idx) in suggestions"
          :key="idx"
          @click="handleSuggestionClick(suggestion)"
          @keydown.enter="handleSuggestionClick(suggestion)"
          @keydown.tab="catchFocus"
          ref="suggestionBoxes"
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

import { ref, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useStore } from "vuex";

const store = useStore();

const searchString = ref("");
const suggestions = ref([]);

const searchInputBoxOffsetX = ref(undefined);
const searchInputBoxOffsetY = ref(undefined);
const searchInputBoxWidth = ref(undefined);
const searchInputBoxHeight = ref(undefined);
const suggestionsBoxOffsetX = ref(undefined);
const suggestionsBoxOffsetY = ref(undefined);
const suggestionsBoxWidth = ref(undefined);

const searchBox = ref(null);
const searchInput = ref(null);
const suggestionBoxes = ref(null);

const calculateSearchInputBoxPosition = () => {
  searchInputBoxOffsetX.value = searchBox.value.getBoundingClientRect().x;
  searchInputBoxOffsetY.value = searchBox.value.getBoundingClientRect().y;
  searchInputBoxWidth.value = searchBox.value.getBoundingClientRect().width;
  searchInputBoxHeight.value = searchBox.value.getBoundingClientRect().height;
};

const calculateSuggestionsBoxPosition = () => {
  suggestionsBoxOffsetX.value = searchBox.value.getBoundingClientRect().x;
  suggestionsBoxOffsetY.value =
    searchBox.value.getBoundingClientRect().y +
    searchBox.value.getBoundingClientRect().height +
    20; // HARDCODED MARGIN-TOP FROM INPUT
  suggestionsBoxWidth.value = searchBox.value.getBoundingClientRect().width;
};

const calculateModalPosition = () => {
  calculateSearchInputBoxPosition();
  calculateSuggestionsBoxPosition();
};

const catchFocus = (event) => {
  if (!suggestionBoxes.value || !searchInput.value) {
    return;
  }

  const searchInputElement = searchInput.value;
  const firstSuggestionBoxElement = suggestionBoxes.value[0];
  const lastSuggestionBoxElement =
    suggestionBoxes.value[suggestionBoxes.value.length - 1];

  if (document.activeElement === searchInputElement) {
    if (event.shiftKey) {
      lastSuggestionBoxElement.focus();
    } else {
      firstSuggestionBoxElement.focus();
    }
    event.preventDefault();
    return;
  }

  if (document.activeElement === firstSuggestionBoxElement) {
    if (event.shiftKey) {
      searchInputElement.focus();
      event.preventDefault();
    }
    return;
  }

  if (document.activeElement === lastSuggestionBoxElement) {
    if (!event.shiftKey) {
      searchInputElement.focus();
      event.preventDefault();
    }
    return;
  }
};

onMounted(() => {
  calculateModalPosition();
  window.addEventListener("resize", calculateModalPosition);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", calculateModalPosition);
});

const clearSuggestions = () => {
  suggestions.value = [];
};

const submitLocation = (location) => {
  const { lat, lng } = location;
  store.commit("setLocation", { lat, lng });
};

const handleSuggestionClick = (suggestion) => {
  submitLocation({ lat: suggestion.lat, lng: suggestion.lng });
  clearSuggestions();
  searchString.value = "";
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

  submitLocation({ lat: place.lat, lng: place.lng });
  clearSuggestions();
  searchString.value = "";
};

watch(suggestions, () => {
  nextTick().then(() => {
    if (searchInput?.value) searchInput.value.focus();
  });
});

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
