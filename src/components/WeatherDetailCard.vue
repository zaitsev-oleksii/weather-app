<template>
  <div
    class="float-left relative flex flex-col grow p-2 w-24 h-full rounded-3xl text-center bg-custom-dark-gunmetal"
  >
    <span class="mt-3 text-md text-white"><slot name="title"></slot></span>
    <span class="mt-auto mb-4 text-3xl text-white font-semibold"
      ><slot name="value"></slot
    ></span>
    <div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-12 h-12">
      <slot name="icon"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "WeatherDetailCard",
  props: {
    config: String
  }
};
</script>
