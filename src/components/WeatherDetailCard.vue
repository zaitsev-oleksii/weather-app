<template>
  <div
    class="float-left relative flex flex-col grow p-2 w-24 h-full rounded-3xl text-center bg-custom-dark-gunmetal"
  >
    <div class="pt-3 text-md text-azureish-white">
      <slot name="title"></slot>
    </div>
    <div
      class="flex flex-wrap justify-center mx-auto mt-auto mb-4 w-full h-8 text-azureish-white font-semibold"
    >
      <div class="text-3xl h-full"><slot name="value"></slot></div>
      <div class="text-3xl h-full"><slot name="unit"></slot></div>
    </div>
    <div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-12 h-12">
      <slot name="icon"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "WeatherDetailCard"
};
</script>
