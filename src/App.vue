<template>
  <div class="container">
    <div
      class="flex flex-col overflow-y-auto w-screen lg:w-2/3 h-screen px-10 pt-5 pb-64 xl:pb-5 mx-auto bg-custom-bunker"
    >
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},

  setup() {}
};
</script>

<style src="./app.css"></style>
