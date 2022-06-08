<template>
  <div class="flex flex-row p-3 w-full h-10 justify-between">
    <div class="text-white text-2xl font-semibold">Preferences</div>
    <div class="w-8 h-8">
      <router-link to="/"><img :src="backIcon" alt="" /></router-link>
    </div>
  </div>
</template>

<script>
import backIcon from "../assets/icons/backArrow.svg";

export default {
  name: "SettingsView",
  setup() {
    return { backIcon };
  }
};
</script>
