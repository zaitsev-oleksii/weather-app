<template>
  <div class="w-full flex gap-1">
    <button
      class="p-1 rounded-md text-lg font-semibold"
      v-for="tabName in tabNames"
      :key="tabName"
      @click="handleTabClick(tabName)"
    >
      {{ tabName }}
    </button>
  </div>
  <div class="w-full">
    <div class="mt-4" v-for="tabName in tabNames" :key="tabName">
      <slot v-if="tabName === currentTab" :name="tabName"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabWidget",
  data() {
    return {
      currentTab: ""
    };
  },
  mounted() {
    if (this.defaultTabName) {
      this.currentTab = this.defaultTabName;
    }
  },
  props: {
    tabNames: Array,
    defaultTabName: String
  },
  methods: {
    handleTabClick(tabName) {
      this.currentTab = tabName;
    }
  }
};
</script>
